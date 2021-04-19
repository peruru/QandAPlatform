package com.qap.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qap.myapp.IntegrationTest;
import com.qap.myapp.domain.Answers;
import com.qap.myapp.repository.AnswersRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AnswersResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnswersResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/answers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AnswersRepository answersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnswersMockMvc;

    private Answers answers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Answers createEntity(EntityManager em) {
        Answers answers = new Answers().text(DEFAULT_TEXT);
        return answers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Answers createUpdatedEntity(EntityManager em) {
        Answers answers = new Answers().text(UPDATED_TEXT);
        return answers;
    }

    @BeforeEach
    public void initTest() {
        answers = createEntity(em);
    }

    @Test
    @Transactional
    void createAnswers() throws Exception {
        int databaseSizeBeforeCreate = answersRepository.findAll().size();
        // Create the Answers
        restAnswersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answers)))
            .andExpect(status().isCreated());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeCreate + 1);
        Answers testAnswers = answersList.get(answersList.size() - 1);
        assertThat(testAnswers.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    void createAnswersWithExistingId() throws Exception {
        // Create the Answers with an existing ID
        answers.setId(1L);

        int databaseSizeBeforeCreate = answersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnswersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answers)))
            .andExpect(status().isBadRequest());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAnswers() throws Exception {
        // Initialize the database
        answersRepository.saveAndFlush(answers);

        // Get all the answersList
        restAnswersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(answers.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)));
    }

    @Test
    @Transactional
    void getAnswers() throws Exception {
        // Initialize the database
        answersRepository.saveAndFlush(answers);

        // Get the answers
        restAnswersMockMvc
            .perform(get(ENTITY_API_URL_ID, answers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(answers.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT));
    }

    @Test
    @Transactional
    void getNonExistingAnswers() throws Exception {
        // Get the answers
        restAnswersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAnswers() throws Exception {
        // Initialize the database
        answersRepository.saveAndFlush(answers);

        int databaseSizeBeforeUpdate = answersRepository.findAll().size();

        // Update the answers
        Answers updatedAnswers = answersRepository.findById(answers.getId()).get();
        // Disconnect from session so that the updates on updatedAnswers are not directly saved in db
        em.detach(updatedAnswers);
        updatedAnswers.text(UPDATED_TEXT);

        restAnswersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnswers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAnswers))
            )
            .andExpect(status().isOk());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
        Answers testAnswers = answersList.get(answersList.size() - 1);
        assertThat(testAnswers.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    void putNonExistingAnswers() throws Exception {
        int databaseSizeBeforeUpdate = answersRepository.findAll().size();
        answers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnswersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, answers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(answers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnswers() throws Exception {
        int databaseSizeBeforeUpdate = answersRepository.findAll().size();
        answers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(answers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnswers() throws Exception {
        int databaseSizeBeforeUpdate = answersRepository.findAll().size();
        answers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnswersWithPatch() throws Exception {
        // Initialize the database
        answersRepository.saveAndFlush(answers);

        int databaseSizeBeforeUpdate = answersRepository.findAll().size();

        // Update the answers using partial update
        Answers partialUpdatedAnswers = new Answers();
        partialUpdatedAnswers.setId(answers.getId());

        restAnswersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnswers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnswers))
            )
            .andExpect(status().isOk());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
        Answers testAnswers = answersList.get(answersList.size() - 1);
        assertThat(testAnswers.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    @Transactional
    void fullUpdateAnswersWithPatch() throws Exception {
        // Initialize the database
        answersRepository.saveAndFlush(answers);

        int databaseSizeBeforeUpdate = answersRepository.findAll().size();

        // Update the answers using partial update
        Answers partialUpdatedAnswers = new Answers();
        partialUpdatedAnswers.setId(answers.getId());

        partialUpdatedAnswers.text(UPDATED_TEXT);

        restAnswersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnswers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnswers))
            )
            .andExpect(status().isOk());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
        Answers testAnswers = answersList.get(answersList.size() - 1);
        assertThat(testAnswers.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    @Transactional
    void patchNonExistingAnswers() throws Exception {
        int databaseSizeBeforeUpdate = answersRepository.findAll().size();
        answers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnswersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, answers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(answers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnswers() throws Exception {
        int databaseSizeBeforeUpdate = answersRepository.findAll().size();
        answers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(answers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnswers() throws Exception {
        int databaseSizeBeforeUpdate = answersRepository.findAll().size();
        answers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswersMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(answers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Answers in the database
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnswers() throws Exception {
        // Initialize the database
        answersRepository.saveAndFlush(answers);

        int databaseSizeBeforeDelete = answersRepository.findAll().size();

        // Delete the answers
        restAnswersMockMvc
            .perform(delete(ENTITY_API_URL_ID, answers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Answers> answersList = answersRepository.findAll();
        assertThat(answersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
