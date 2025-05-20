package com.ccsw.tutorial.customer;

import com.ccsw.tutorial.customer.model.Customer;
import com.ccsw.tutorial.customer.model.CustomerDto;

import java.util.List;

public interface CustomerService {

    /**
     * Método para recuperar todos los clientes
     *
     * @return  {@link List} de {@link CustomerDto}
     */
    List<Customer> findAll();

    /**
     * Método para crear o actualizar un cliente
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    void save(Long id, CustomerDto dto) throws Exception;

    /**
     * Método para borrar un cliente
     *
     * @param id PK de la entidad
     */
    void delete(Long id) throws Exception;

    Customer get(Long id);
}
