package com.qap.myapp.repository;

import com.qap.myapp.domain.QuestionLikes;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the QuestionLikes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionLikesRepository extends JpaRepository<QuestionLikes, Long> {}
