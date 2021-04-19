package com.qap.myapp.web.rest;

import com.qap.myapp.domain.AnswerLikes;
import com.qap.myapp.repository.AnswerLikesRepository;
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
 * REST controller for managing {@link com.qap.myapp.domain.AnswerLikes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AnswerLikesResource {

    private final Logger log = LoggerFactory.getLogger(AnswerLikesResource.class);

    private static final String ENTITY_NAME = "answerLikes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnswerLikesRepository answerLikesRepository;

    public AnswerLikesResource(AnswerLikesRepository answerLikesRepository) {
        this.answerLikesRepository = answerLikesRepository;
    }

    /**
     * {@code POST  /answer-likes} : Create a new answerLikes.
     *
     * @param answerLikes the answerLikes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new answerLikes, or with status {@code 400 (Bad Request)} if the answerLikes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/answer-likes")
    public ResponseEntity<AnswerLikes> createAnswerLikes(@RequestBody AnswerLikes answerLikes) throws URISyntaxException {
        log.debug("REST request to save AnswerLikes : {}", answerLikes);
        if (answerLikes.getId() != null) {
            throw new BadRequestAlertException("A new answerLikes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AnswerLikes result = answerLikesRepository.save(answerLikes);
        return ResponseEntity
            .created(new URI("/api/answer-likes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /answer-likes/:id} : Updates an existing answerLikes.
     *
     * @param id the id of the answerLikes to save.
     * @param answerLikes the answerLikes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated answerLikes,
     * or with status {@code 400 (Bad Request)} if the answerLikes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the answerLikes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/answer-likes/{id}")
    public ResponseEntity<AnswerLikes> updateAnswerLikes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AnswerLikes answerLikes
    ) throws URISyntaxException {
        log.debug("REST request to update AnswerLikes : {}, {}", id, answerLikes);
        if (answerLikes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, answerLikes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!answerLikesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AnswerLikes result = answerLikesRepository.save(answerLikes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, answerLikes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /answer-likes/:id} : Partial updates given fields of an existing answerLikes, field will ignore if it is null
     *
     * @param id the id of the answerLikes to save.
     * @param answerLikes the answerLikes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated answerLikes,
     * or with status {@code 400 (Bad Request)} if the answerLikes is not valid,
     * or with status {@code 404 (Not Found)} if the answerLikes is not found,
     * or with status {@code 500 (Internal Server Error)} if the answerLikes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/answer-likes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<AnswerLikes> partialUpdateAnswerLikes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AnswerLikes answerLikes
    ) throws URISyntaxException {
        log.debug("REST request to partial update AnswerLikes partially : {}, {}", id, answerLikes);
        if (answerLikes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, answerLikes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!answerLikesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AnswerLikes> result = answerLikesRepository
            .findById(answerLikes.getId())
            .map(
                existingAnswerLikes -> {
                    return existingAnswerLikes;
                }
            )
            .map(answerLikesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, answerLikes.getId().toString())
        );
    }

    /**
     * {@code GET  /answer-likes} : get all the answerLikes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of answerLikes in body.
     */
    @GetMapping("/answer-likes")
    public List<AnswerLikes> getAllAnswerLikes() {
        log.debug("REST request to get all AnswerLikes");
        return answerLikesRepository.findAll();
    }

    /**
     * {@code GET  /answer-likes/:id} : get the "id" answerLikes.
     *
     * @param id the id of the answerLikes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the answerLikes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/answer-likes/{id}")
    public ResponseEntity<AnswerLikes> getAnswerLikes(@PathVariable Long id) {
        log.debug("REST request to get AnswerLikes : {}", id);
        Optional<AnswerLikes> answerLikes = answerLikesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(answerLikes);
    }

    /**
     * {@code DELETE  /answer-likes/:id} : delete the "id" answerLikes.
     *
     * @param id the id of the answerLikes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/answer-likes/{id}")
    public ResponseEntity<Void> deleteAnswerLikes(@PathVariable Long id) {
        log.debug("REST request to delete AnswerLikes : {}", id);
        answerLikesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
