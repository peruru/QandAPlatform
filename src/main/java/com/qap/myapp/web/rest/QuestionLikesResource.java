package com.qap.myapp.web.rest;

import com.qap.myapp.domain.QuestionLikes;
import com.qap.myapp.repository.QuestionLikesRepository;
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
 * REST controller for managing {@link com.qap.myapp.domain.QuestionLikes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class QuestionLikesResource {

    private final Logger log = LoggerFactory.getLogger(QuestionLikesResource.class);

    private static final String ENTITY_NAME = "questionLikes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuestionLikesRepository questionLikesRepository;

    public QuestionLikesResource(QuestionLikesRepository questionLikesRepository) {
        this.questionLikesRepository = questionLikesRepository;
    }

    /**
     * {@code POST  /question-likes} : Create a new questionLikes.
     *
     * @param questionLikes the questionLikes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new questionLikes, or with status {@code 400 (Bad Request)} if the questionLikes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/question-likes")
    public ResponseEntity<QuestionLikes> createQuestionLikes(@RequestBody QuestionLikes questionLikes) throws URISyntaxException {
        log.debug("REST request to save QuestionLikes : {}", questionLikes);
        if (questionLikes.getId() != null) {
            throw new BadRequestAlertException("A new questionLikes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionLikes result = questionLikesRepository.save(questionLikes);
        return ResponseEntity
            .created(new URI("/api/question-likes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /question-likes/:id} : Updates an existing questionLikes.
     *
     * @param id the id of the questionLikes to save.
     * @param questionLikes the questionLikes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionLikes,
     * or with status {@code 400 (Bad Request)} if the questionLikes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the questionLikes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/question-likes/{id}")
    public ResponseEntity<QuestionLikes> updateQuestionLikes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody QuestionLikes questionLikes
    ) throws URISyntaxException {
        log.debug("REST request to update QuestionLikes : {}, {}", id, questionLikes);
        if (questionLikes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, questionLikes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!questionLikesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        QuestionLikes result = questionLikesRepository.save(questionLikes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionLikes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /question-likes/:id} : Partial updates given fields of an existing questionLikes, field will ignore if it is null
     *
     * @param id the id of the questionLikes to save.
     * @param questionLikes the questionLikes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionLikes,
     * or with status {@code 400 (Bad Request)} if the questionLikes is not valid,
     * or with status {@code 404 (Not Found)} if the questionLikes is not found,
     * or with status {@code 500 (Internal Server Error)} if the questionLikes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/question-likes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<QuestionLikes> partialUpdateQuestionLikes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody QuestionLikes questionLikes
    ) throws URISyntaxException {
        log.debug("REST request to partial update QuestionLikes partially : {}, {}", id, questionLikes);
        if (questionLikes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, questionLikes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!questionLikesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<QuestionLikes> result = questionLikesRepository
            .findById(questionLikes.getId())
            .map(
                existingQuestionLikes -> {
                    return existingQuestionLikes;
                }
            )
            .map(questionLikesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionLikes.getId().toString())
        );
    }

    /**
     * {@code GET  /question-likes} : get all the questionLikes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questionLikes in body.
     */
    @GetMapping("/question-likes")
    public List<QuestionLikes> getAllQuestionLikes() {
        log.debug("REST request to get all QuestionLikes");
        return questionLikesRepository.findAll();
    }

    /**
     * {@code GET  /question-likes/:id} : get the "id" questionLikes.
     *
     * @param id the id of the questionLikes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the questionLikes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/question-likes/{id}")
    public ResponseEntity<QuestionLikes> getQuestionLikes(@PathVariable Long id) {
        log.debug("REST request to get QuestionLikes : {}", id);
        Optional<QuestionLikes> questionLikes = questionLikesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(questionLikes);
    }

    /**
     * {@code DELETE  /question-likes/:id} : delete the "id" questionLikes.
     *
     * @param id the id of the questionLikes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/question-likes/{id}")
    public ResponseEntity<Void> deleteQuestionLikes(@PathVariable Long id) {
        log.debug("REST request to delete QuestionLikes : {}", id);
        questionLikesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
