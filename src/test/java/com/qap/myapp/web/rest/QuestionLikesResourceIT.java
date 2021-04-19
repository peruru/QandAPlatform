package com.qap.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qap.myapp.IntegrationTest;
import com.qap.myapp.domain.QuestionLikes;
import com.qap.myapp.repository.QuestionLikesRepository;
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
 * Integration tests for the {@link QuestionLikesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class QuestionLikesResourceIT {

    private static final String ENTITY_API_URL = "/api/question-likes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private QuestionLikesRepository questionLikesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restQuestionLikesMockMvc;

    private QuestionLikes questionLikes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuestionLikes createEntity(EntityManager em) {
        QuestionLikes questionLikes = new QuestionLikes();
        return questionLikes;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuestionLikes createUpdatedEntity(EntityManager em) {
        QuestionLikes questionLikes = new QuestionLikes();
        return questionLikes;
    }

    @BeforeEach
    public void initTest() {
        questionLikes = createEntity(em);
    }

    @Test
    @Transactional
    void createQuestionLikes() throws Exception {
        int databaseSizeBeforeCreate = questionLikesRepository.findAll().size();
        // Create the QuestionLikes
        restQuestionLikesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(questionLikes)))
            .andExpect(status().isCreated());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionLikes testQuestionLikes = questionLikesList.get(questionLikesList.size() - 1);
    }

    @Test
    @Transactional
    void createQuestionLikesWithExistingId() throws Exception {
        // Create the QuestionLikes with an existing ID
        questionLikes.setId(1L);

        int databaseSizeBeforeCreate = questionLikesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionLikesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(questionLikes)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllQuestionLikes() throws Exception {
        // Initialize the database
        questionLikesRepository.saveAndFlush(questionLikes);

        // Get all the questionLikesList
        restQuestionLikesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionLikes.getId().intValue())));
    }

    @Test
    @Transactional
    void getQuestionLikes() throws Exception {
        // Initialize the database
        questionLikesRepository.saveAndFlush(questionLikes);

        // Get the questionLikes
        restQuestionLikesMockMvc
            .perform(get(ENTITY_API_URL_ID, questionLikes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(questionLikes.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingQuestionLikes() throws Exception {
        // Get the questionLikes
        restQuestionLikesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewQuestionLikes() throws Exception {
        // Initialize the database
        questionLikesRepository.saveAndFlush(questionLikes);

        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();

        // Update the questionLikes
        QuestionLikes updatedQuestionLikes = questionLikesRepository.findById(questionLikes.getId()).get();
        // Disconnect from session so that the updates on updatedQuestionLikes are not directly saved in db
        em.detach(updatedQuestionLikes);

        restQuestionLikesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedQuestionLikes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedQuestionLikes))
            )
            .andExpect(status().isOk());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
        QuestionLikes testQuestionLikes = questionLikesList.get(questionLikesList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingQuestionLikes() throws Exception {
        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();
        questionLikes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionLikesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, questionLikes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(questionLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchQuestionLikes() throws Exception {
        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();
        questionLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionLikesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(questionLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamQuestionLikes() throws Exception {
        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();
        questionLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionLikesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(questionLikes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateQuestionLikesWithPatch() throws Exception {
        // Initialize the database
        questionLikesRepository.saveAndFlush(questionLikes);

        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();

        // Update the questionLikes using partial update
        QuestionLikes partialUpdatedQuestionLikes = new QuestionLikes();
        partialUpdatedQuestionLikes.setId(questionLikes.getId());

        restQuestionLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuestionLikes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuestionLikes))
            )
            .andExpect(status().isOk());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
        QuestionLikes testQuestionLikes = questionLikesList.get(questionLikesList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateQuestionLikesWithPatch() throws Exception {
        // Initialize the database
        questionLikesRepository.saveAndFlush(questionLikes);

        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();

        // Update the questionLikes using partial update
        QuestionLikes partialUpdatedQuestionLikes = new QuestionLikes();
        partialUpdatedQuestionLikes.setId(questionLikes.getId());

        restQuestionLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuestionLikes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuestionLikes))
            )
            .andExpect(status().isOk());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
        QuestionLikes testQuestionLikes = questionLikesList.get(questionLikesList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingQuestionLikes() throws Exception {
        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();
        questionLikes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, questionLikes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(questionLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchQuestionLikes() throws Exception {
        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();
        questionLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(questionLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamQuestionLikes() throws Exception {
        int databaseSizeBeforeUpdate = questionLikesRepository.findAll().size();
        questionLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionLikesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(questionLikes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the QuestionLikes in the database
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteQuestionLikes() throws Exception {
        // Initialize the database
        questionLikesRepository.saveAndFlush(questionLikes);

        int databaseSizeBeforeDelete = questionLikesRepository.findAll().size();

        // Delete the questionLikes
        restQuestionLikesMockMvc
            .perform(delete(ENTITY_API_URL_ID, questionLikes.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<QuestionLikes> questionLikesList = questionLikesRepository.findAll();
        assertThat(questionLikesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
