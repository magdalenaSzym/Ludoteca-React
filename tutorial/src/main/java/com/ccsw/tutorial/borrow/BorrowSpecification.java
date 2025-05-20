package com.ccsw.tutorial.borrow;

import com.ccsw.tutorial.borrow.model.Borrow;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class BorrowSpecification implements Specification<Borrow> {

    private static final long serialVersionUID = 1L;

    private final SearchCriteria criteria;

    public BorrowSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<Borrow> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        if (criteria.getOperation().equalsIgnoreCase(":") && criteria.getValue() != null) {
            Path<String> path = getPath(root);
            if (path.getJavaType() == String.class) {
                return builder.like(path, "%" + criteria.getValue() + "%");
            } else {
                return builder.equal(path, criteria.getValue());
            }
        } else if (criteria.getOperation().equalsIgnoreCase("lessThanOrEqualsTo") && criteria.getValue() != null) {
            LocalDate date = (LocalDate) criteria.getValue();
            return builder.lessThanOrEqualTo(root.get("startDate"), date);
        } else if (criteria.getOperation().equalsIgnoreCase("greaterThanOrEqualTo") && criteria.getValue() != null) {
            LocalDate date = (LocalDate) criteria.getValue();
            return builder.greaterThanOrEqualTo(root.get("finishDate"), date);
        }

        return null;
    }

    private Path<String> getPath(Root<Borrow> root) {
        String key = criteria.getKey();
        String[] split = key.split("[.]", 0);

        Path<String> expression = root.get(split[0]);
        for (int i = 1; i < split.length; i++) {
            expression = expression.get(split[i]);
        }
        return expression;
    }
}
