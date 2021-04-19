package com.qap.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qap.myapp.IntegrationTest;
import com.qap.myapp.domain.AnswerLikes;
import com.qap.myapp.repository.AnswerLikesRepository;
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
 * Integration tests for the {@link AnswerLikesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnswerLikesResourceIT {

    private static final String ENTITY_API_URL = "/api/answer-likes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AnswerLikesRepository answerLikesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnswerLikesMockMvc;

    private AnswerLikes answerLikes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AnswerLikes createEntity(EntityManager em) {
        AnswerLikes answerLikes = new AnswerLikes();
        return answerLikes;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AnswerLikes createUpdatedEntity(EntityManager em) {
        AnswerLikes answerLikes = new AnswerLikes();
        return answerLikes;
    }

    @BeforeEach
    public void initTest() {
        answerLikes = createEntity(em);
    }

    @Test
    @Transactional
    void createAnswerLikes() throws Exception {
        int databaseSizeBeforeCreate = answerLikesRepository.findAll().size();
        // Create the AnswerLikes
        restAnswerLikesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answerLikes)))
            .andExpect(status().isCreated());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeCreate + 1);
        AnswerLikes testAnswerLikes = answerLikesList.get(answerLikesList.size() - 1);
    }

    @Test
    @Transactional
    void createAnswerLikesWithExistingId() throws Exception {
        // Create the AnswerLikes with an existing ID
        answerLikes.setId(1L);

        int databaseSizeBeforeCreate = answerLikesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnswerLikesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answerLikes)))
            .andExpect(status().isBadRequest());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAnswerLikes() throws Exception {
        // Initialize the database
        answerLikesRepository.saveAndFlush(answerLikes);

        // Get all the answerLikesList
        restAnswerLikesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(answerLikes.getId().intValue())));
    }

    @Test
    @Transactional
    void getAnswerLikes() throws Exception {
        // Initialize the database
        answerLikesRepository.saveAndFlush(answerLikes);

        // Get the answerLikes
        restAnswerLikesMockMvc
            .perform(get(ENTITY_API_URL_ID, answerLikes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(answerLikes.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAnswerLikes() throws Exception {
        // Get the answerLikes
        restAnswerLikesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAnswerLikes() throws Exception {
        // Initialize the database
        answerLikesRepository.saveAndFlush(answerLikes);

        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();

        // Update the answerLikes
        AnswerLikes updatedAnswerLikes = answerLikesRepository.findById(answerLikes.getId()).get();
        // Disconnect from session so that the updates on updatedAnswerLikes are not directly saved in db
        em.detach(updatedAnswerLikes);

        restAnswerLikesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnswerLikes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAnswerLikes))
            )
            .andExpect(status().isOk());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
        AnswerLikes testAnswerLikes = answerLikesList.get(answerLikesList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingAnswerLikes() throws Exception {
        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();
        answerLikes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnswerLikesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, answerLikes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(answerLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnswerLikes() throws Exception {
        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();
        answerLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerLikesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(answerLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnswerLikes() throws Exception {
        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();
        answerLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerLikesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answerLikes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnswerLikesWithPatch() throws Exception {
        // Initialize the database
        answerLikesRepository.saveAndFlush(answerLikes);

        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();

        // Update the answerLikes using partial update
        AnswerLikes partialUpdatedAnswerLikes = new AnswerLikes();
        partialUpdatedAnswerLikes.setId(answerLikes.getId());

        restAnswerLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnswerLikes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnswerLikes))
            )
            .andExpect(status().isOk());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
        AnswerLikes testAnswerLikes = answerLikesList.get(answerLikesList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateAnswerLikesWithPatch() throws Exception {
        // Initialize the database
        answerLikesRepository.saveAndFlush(answerLikes);

        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();

        // Update the answerLikes using partial update
        AnswerLikes partialUpdatedAnswerLikes = new AnswerLikes();
        partialUpdatedAnswerLikes.setId(answerLikes.getId());

        restAnswerLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnswerLikes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnswerLikes))
            )
            .andExpect(status().isOk());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
        AnswerLikes testAnswerLikes = answerLikesList.get(answerLikesList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingAnswerLikes() throws Exception {
        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();
        answerLikes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnswerLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, answerLikes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(answerLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnswerLikes() throws Exception {
        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();
        answerLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerLikesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(answerLikes))
            )
            .andExpect(status().isBadRequest());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnswerLikes() throws Exception {
        int databaseSizeBeforeUpdate = answerLikesRepository.findAll().size();
        answerLikes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerLikesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(answerLikes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AnswerLikes in the database
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnswerLikes() throws Exception {
        // Initialize the database
        answerLikesRepository.saveAndFlush(answerLikes);

        int databaseSizeBeforeDelete = answerLikesRepository.findAll().size();

        // Delete the answerLikes
        restAnswerLikesMockMvc
            .perform(delete(ENTITY_API_URL_ID, answerLikes.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AnswerLikes> answerLikesList = answerLikesRepository.findAll();
        assertThat(answerLikesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
