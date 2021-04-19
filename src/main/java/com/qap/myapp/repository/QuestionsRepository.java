package com.qap.myapp.repository;

import com.qap.myapp.domain.Questions;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Questions entity.
 */
@Repository
public interface QuestionsRepository extends JpaRepository<Questions, Long> {
    @Query(
        value = "select distinct questions from Questions questions left join fetch questions.companies left join fetch questions.tags",
        countQuery = "select count(distinct questions) from Questions questions"
    )
    Page<Questions> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct questions from Questions questions left join fetch questions.companies left join fetch questions.tags")
    List<Questions> findAllWithEagerRelationships();

    @Query(
        "select questions from Questions questions left join fetch questions.companies left join fetch questions.tags where questions.id =:id"
    )
    Optional<Questions> findOneWithEagerRelationships(@Param("id") Long id);
}
