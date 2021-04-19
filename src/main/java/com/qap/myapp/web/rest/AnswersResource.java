package com.qap.myapp.web.rest;

import com.qap.myapp.domain.Answers;
import com.qap.myapp.repository.AnswersRepository;
import com.qap.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.qap.myapp.domain.Answers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AnswersResource {

    private final Logger log = LoggerFactory.getLogger(AnswersResource.class);

    private static final String ENTITY_NAME = "answers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnswersRepository answersRepository;

    public AnswersResource(AnswersRepository answersRepository) {
        this.answersRepository = answersRepository;
    }

    /**
     * {@code POST  /answers} : Create a new answers.
     *
     * @param answers the answers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new answers, or with status {@code 400 (Bad Request)} if the answers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/answers")
    public ResponseEntity<Answers> createAnswers(@RequestBody Answers answers) throws URISyntaxException {
        log.debug("REST request to save Answers : {}", answers);
        if (answers.getId() != null) {
            throw new BadRequestAlertException("A new answers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Answers result = answersRepository.save(answers);
        return ResponseEntity
            .created(new URI("/api/answers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /answers/:id} : Updates an existing answers.
     *
     * @param id the id of the answers to save.
     * @param answers the answers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated answers,
     * or with status {@code 400 (Bad Request)} if the answers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the answers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/answers/{id}")
    public ResponseEntity<Answers> updateAnswers(@PathVariable(value = "id", required = false) final Long id, @RequestBody Answers answers)
        throws URISyntaxException {
        log.debug("REST request to update Answers : {}, {}", id, answers);
        if (answers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, answers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!answersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Answers result = answersRepository.save(answers);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, answers.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /answers/:id} : Partial updates given fields of an existing answers, field will ignore if it is null
     *
     * @param id the id of the answers to save.
     * @param answers the answers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated answers,
     * or with status {@code 400 (Bad Request)} if the answers is not valid,
     * or with status {@code 404 (Not Found)} if the answers is not found,
     * or with status {@code 500 (Internal Server Error)} if the answers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/answers/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Answers> partialUpdateAnswers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Answers answers
    ) throws URISyntaxException {
        log.debug("REST request to partial update Answers partially : {}, {}", id, answers);
        if (answers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, answers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!answersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Answers> result = answersRepository
            .findById(answers.getId())
            .map(
                existingAnswers -> {
                    if (answers.getText() != null) {
                        existingAnswers.setText(answers.getText());
                    }

                    return existingAnswers;
                }
            )
            .map(answersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, answers.getId().toString())
        );
    }

    /**
     * {@code GET  /answers} : get all the answers.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of answers in body.
     */
    @GetMapping("/answers")
    public List<Answers> getAllAnswers(@RequestParam(required = false) String filter) {
        if ("answerlikes-is-null".equals(filter)) {
            log.debug("REST request to get all Answerss where answerLikes is null");
            return StreamSupport
                .stream(answersRepository.findAll().spliterator(), false)
                .filter(answers -> answers.getAnswerLikes() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Answers");
        return answersRepository.findAll();
    }

    /**
     * {@code GET  /answers/:id} : get the "id" answers.
     *
     * @param id the id of the answers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the answers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/answers/{id}")
    public ResponseEntity<Answers> getAnswers(@PathVariable Long id) {
        log.debug("REST request to get Answers : {}", id);
        Optional<Answers> answers = answersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(answers);
    }

    /**
     * {@code DELETE  /answers/:id} : delete the "id" answers.
     *
     * @param id the id of the answers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> deleteAnswers(@PathVariable Long id) {
        log.debug("REST request to delete Answers : {}", id);
        answersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
