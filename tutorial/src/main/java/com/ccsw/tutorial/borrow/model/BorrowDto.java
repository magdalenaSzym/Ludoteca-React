package com.ccsw.tutorial.borrow.model;

import com.ccsw.tutorial.customer.model.CustomerDto;
import com.ccsw.tutorial.game.model.GameDto;

import java.time.LocalDate;

public class BorrowDto {

    private Long id;

    private GameDto game;

    private CustomerDto customer;

    private LocalDate startDate;

    private LocalDate finishDate;

    /**
     * @return id
     */
    public Long getId() {

        return this.id;
    }

    /**
     * @param id new value of {@link #getId}.
     */
    public void setId(Long id) {

        this.id = id;
    }

    /**
     * @return game
     */
    public GameDto getGame() {

        return this.game;
    }

    /**
     * @param game new value of {@link #getGame}.
     */
    public void setGame(GameDto game) {

        this.game = game;
    }

    /**
     * @return customer
     */
    public CustomerDto getCustomer() {

        return this.customer;
    }

    /**
     * @param customer new value of {@link #getCustomer}.
     */
    public void setCustomer(CustomerDto customer) {

        this.customer = customer;
    }

    /**
     * @return startDate
     */
    public LocalDate getStartDate() {
        return startDate;
    }

    /**
     * @param startDate new value of {@link #getStartDate}.
     */
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    /**
     * @return finishDate
     */
    public LocalDate getFinishDate() {
        return finishDate;
    }

    /**
     * @param finishDate new value of {@link #getFinishDate}.
     */
    public void setFinishDate(LocalDate finishDate) {
        this.finishDate = finishDate;
    }
}
