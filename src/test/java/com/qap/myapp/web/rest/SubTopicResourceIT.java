package com.qap.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.qap.myapp.IntegrationTest;
import com.qap.myapp.domain.SubTopic;
import com.qap.myapp.repository.SubTopicRepository;
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
 * Integration tests for the {@link SubTopicResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SubTopicResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sub-topics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SubTopicRepository subTopicRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSubTopicMockMvc;

    private SubTopic subTopic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubTopic createEntity(EntityManager em) {
        SubTopic subTopic = new SubTopic().name(DEFAULT_NAME);
        return subTopic;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubTopic createUpdatedEntity(EntityManager em) {
        SubTopic subTopic = new SubTopic().name(UPDATED_NAME);
        return subTopic;
    }

    @BeforeEach
    public void initTest() {
        subTopic = createEntity(em);
    }

    @Test
    @Transactional
    void createSubTopic() throws Exception {
        int databaseSizeBeforeCreate = subTopicRepository.findAll().size();
        // Create the SubTopic
        restSubTopicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subTopic)))
            .andExpect(status().isCreated());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeCreate + 1);
        SubTopic testSubTopic = subTopicList.get(subTopicList.size() - 1);
        assertThat(testSubTopic.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createSubTopicWithExistingId() throws Exception {
        // Create the SubTopic with an existing ID
        subTopic.setId(1L);

        int databaseSizeBeforeCreate = subTopicRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubTopicMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subTopic)))
            .andExpect(status().isBadRequest());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSubTopics() throws Exception {
        // Initialize the database
        subTopicRepository.saveAndFlush(subTopic);

        // Get all the subTopicList
        restSubTopicMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(subTopic.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getSubTopic() throws Exception {
        // Initialize the database
        subTopicRepository.saveAndFlush(subTopic);

        // Get the subTopic
        restSubTopicMockMvc
            .perform(get(ENTITY_API_URL_ID, subTopic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(subTopic.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingSubTopic() throws Exception {
        // Get the subTopic
        restSubTopicMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSubTopic() throws Exception {
        // Initialize the database
        subTopicRepository.saveAndFlush(subTopic);

        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();

        // Update the subTopic
        SubTopic updatedSubTopic = subTopicRepository.findById(subTopic.getId()).get();
        // Disconnect from session so that the updates on updatedSubTopic are not directly saved in db
        em.detach(updatedSubTopic);
        updatedSubTopic.name(UPDATED_NAME);

        restSubTopicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSubTopic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSubTopic))
            )
            .andExpect(status().isOk());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
        SubTopic testSubTopic = subTopicList.get(subTopicList.size() - 1);
        assertThat(testSubTopic.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingSubTopic() throws Exception {
        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();
        subTopic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubTopicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, subTopic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subTopic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSubTopic() throws Exception {
        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();
        subTopic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTopicMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subTopic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSubTopic() throws Exception {
        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();
        subTopic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTopicMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subTopic)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSubTopicWithPatch() throws Exception {
        // Initialize the database
        subTopicRepository.saveAndFlush(subTopic);

        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();

        // Update the subTopic using partial update
        SubTopic partialUpdatedSubTopic = new SubTopic();
        partialUpdatedSubTopic.setId(subTopic.getId());

        restSubTopicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubTopic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubTopic))
            )
            .andExpect(status().isOk());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
        SubTopic testSubTopic = subTopicList.get(subTopicList.size() - 1);
        assertThat(testSubTopic.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateSubTopicWithPatch() throws Exception {
        // Initialize the database
        subTopicRepository.saveAndFlush(subTopic);

        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();

        // Update the subTopic using partial update
        SubTopic partialUpdatedSubTopic = new SubTopic();
        partialUpdatedSubTopic.setId(subTopic.getId());

        partialUpdatedSubTopic.name(UPDATED_NAME);

        restSubTopicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubTopic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubTopic))
            )
            .andExpect(status().isOk());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
        SubTopic testSubTopic = subTopicList.get(subTopicList.size() - 1);
        assertThat(testSubTopic.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingSubTopic() throws Exception {
        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();
        subTopic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubTopicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, subTopic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subTopic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSubTopic() throws Exception {
        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();
        subTopic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTopicMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subTopic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSubTopic() throws Exception {
        int databaseSizeBeforeUpdate = subTopicRepository.findAll().size();
        subTopic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubTopicMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(subTopic)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubTopic in the database
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSubTopic() throws Exception {
        // Initialize the database
        subTopicRepository.saveAndFlush(subTopic);

        int databaseSizeBeforeDelete = subTopicRepository.findAll().size();

        // Delete the subTopic
        restSubTopicMockMvc
            .perform(delete(ENTITY_API_URL_ID, subTopic.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SubTopic> subTopicList = subTopicRepository.findAll();
        assertThat(subTopicList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
