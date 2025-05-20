package com.ccsw.tutorial.borrow;

import com.ccsw.tutorial.borrow.model.Borrow;
import com.ccsw.tutorial.borrow.model.BorrowDto;
import com.ccsw.tutorial.borrow.model.BorrowSearchDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface BorrowService {

    /**
     * Método para recuperar un listado paginado de {@link Borrow}
     *
     * @param dto dto de búsqueda
     * @return {@link Page} de {@link Borrow}
     */
    Page<Borrow> findPage(Long gameId, Long customerId, LocalDate date, BorrowSearchDto dto);

    /**
     * Recupera la lista de prestamos
     * @return {@link List} de {@link Borrow}
     */
    List<Borrow> findAll();

    /**
     * Método para crear  un {@link Borrow}
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    void save(Long id, BorrowDto dto) throws Exception;

    /**
     * Método para eliminar un {@link Borrow}
     *
     * @param id PK de la entidad
     */
    void delete(Long id) throws Exception;

}
