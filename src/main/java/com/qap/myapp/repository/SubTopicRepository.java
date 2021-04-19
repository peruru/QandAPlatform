package com.qap.myapp.repository;

import com.qap.myapp.domain.SubTopic;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SubTopic entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SubTopicRepository extends JpaRepository<SubTopic, Long> {}
