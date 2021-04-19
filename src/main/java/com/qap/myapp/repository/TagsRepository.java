package com.qap.myapp.repository;

import com.qap.myapp.domain.Tags;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tags entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TagsRepository extends JpaRepository<Tags, Long> {}
