package com.qap.myapp.web.rest;

import com.qap.myapp.domain.SubTopic;
import com.qap.myapp.repository.SubTopicRepository;
import com.qap.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.qap.myapp.domain.SubTopic}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SubTopicResource {

    private final Logger log = LoggerFactory.getLogger(SubTopicResource.class);

    private static final String ENTITY_NAME = "subTopic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SubTopicRepository subTopicRepository;

    public SubTopicResource(SubTopicRepository subTopicRepository) {
        this.subTopicRepository = subTopicRepository;
    }

    /**
     * {@code POST  /sub-topics} : Create a new subTopic.
     *
     * @param subTopic the subTopic to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subTopic, or with status {@code 400 (Bad Request)} if the subTopic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sub-topics")
    public ResponseEntity<SubTopic> createSubTopic(@RequestBody SubTopic subTopic) throws URISyntaxException {
        log.debug("REST request to save SubTopic : {}", subTopic);
        if (subTopic.getId() != null) {
            throw new BadRequestAlertException("A new subTopic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SubTopic result = subTopicRepository.save(subTopic);
        return ResponseEntity
            .created(new URI("/api/sub-topics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sub-topics/:id} : Updates an existing subTopic.
     *
     * @param id the id of the subTopic to save.
     * @param subTopic the subTopic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subTopic,
     * or with status {@code 400 (Bad Request)} if the subTopic is not valid,
     * or with status {@code 500 (Internal Server Error)} if the subTopic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sub-topics/{id}")
    public ResponseEntity<SubTopic> updateSubTopic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubTopic subTopic
    ) throws URISyntaxException {
        log.debug("REST request to update SubTopic : {}, {}", id, subTopic);
        if (subTopic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subTopic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subTopicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SubTopic result = subTopicRepository.save(subTopic);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subTopic.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sub-topics/:id} : Partial updates given fields of an existing subTopic, field will ignore if it is null
     *
     * @param id the id of the subTopic to save.
     * @param subTopic the subTopic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subTopic,
     * or with status {@code 400 (Bad Request)} if the subTopic is not valid,
     * or with status {@code 404 (Not Found)} if the subTopic is not found,
     * or with status {@code 500 (Internal Server Error)} if the subTopic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sub-topics/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SubTopic> partialUpdateSubTopic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubTopic subTopic
    ) throws URISyntaxException {
        log.debug("REST request to partial update SubTopic partially : {}, {}", id, subTopic);
        if (subTopic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subTopic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subTopicRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SubTopic> result = subTopicRepository
            .findById(subTopic.getId())
            .map(
                existingSubTopic -> {
                    if (subTopic.getName() != null) {
                        existingSubTopic.setName(subTopic.getName());
                    }

                    return existingSubTopic;
                }
            )
            .map(subTopicRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, subTopic.getId().toString())
        );
    }

    /**
     * {@code GET  /sub-topics} : get all the subTopics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of subTopics in body.
     */
    @GetMapping("/sub-topics")
    public List<SubTopic> getAllSubTopics() {
        log.debug("REST request to get all SubTopics");
        return subTopicRepository.findAll();
    }

    /**
     * {@code GET  /sub-topics/:id} : get the "id" subTopic.
     *
     * @param id the id of the subTopic to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the subTopic, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sub-topics/{id}")
    public ResponseEntity<SubTopic> getSubTopic(@PathVariable Long id) {
        log.debug("REST request to get SubTopic : {}", id);
        Optional<SubTopic> subTopic = subTopicRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(subTopic);
    }

    /**
     * {@code DELETE  /sub-topics/:id} : delete the "id" subTopic.
     *
     * @param id the id of the subTopic to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sub-topics/{id}")
    public ResponseEntity<Void> deleteSubTopic(@PathVariable Long id) {
        log.debug("REST request to delete SubTopic : {}", id);
        subTopicRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
