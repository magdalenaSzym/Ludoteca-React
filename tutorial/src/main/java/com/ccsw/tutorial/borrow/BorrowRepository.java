package com.ccsw.tutorial.borrow;

import com.ccsw.tutorial.borrow.model.Borrow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

public interface BorrowRepository extends CrudRepository<Borrow, Long>, JpaSpecificationExecutor<Borrow> {

    @Override
    @EntityGraph(attributePaths = { "game", "customer" })
    Page<Borrow> findAll(Specification<Borrow> spec, Pageable pageable);
}
