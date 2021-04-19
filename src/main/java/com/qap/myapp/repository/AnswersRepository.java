package com.qap.myapp.repository;

import com.qap.myapp.domain.Answers;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Answers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnswersRepository extends JpaRepository<Answers, Long> {}
