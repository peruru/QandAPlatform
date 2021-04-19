package com.qap.myapp.repository;

import com.qap.myapp.domain.AnswerLikes;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AnswerLikes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnswerLikesRepository extends JpaRepository<AnswerLikes, Long> {}
