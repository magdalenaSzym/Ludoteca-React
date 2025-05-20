package com.ccsw.tutorial.borrow.model;

import com.ccsw.tutorial.common.pagination.PageableRequest;

public class BorrowSearchDto {

    private PageableRequest pageable;

    public PageableRequest getPageable() {

        return pageable;
    }

    public void setPageable(PageableRequest pageable) {

        this.pageable = pageable;
    }
}
