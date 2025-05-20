package com.ccsw.tutorial.borrow;

import com.ccsw.tutorial.borrow.model.BorrowDto;
import com.ccsw.tutorial.borrow.model.BorrowSearchDto;
import com.ccsw.tutorial.common.pagination.PageableRequest;
import com.ccsw.tutorial.config.ResponsePage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class BorrowIT {

    public static final String LOCALHOST = "http://localhost:";
    public static final String SERVICE_PATH = "/borrow";

    private static final long EXISTS_GAME_ID = 1L;
    private static final long NOT_EXISTS_GAME_ID = 0L;
    private static final long EXISTS_CUSTOMER_ID = 2L;
    private static final long NOT_EXISTS_CUSTOMER_ID = 0L;

    private static final LocalDate EXISTS_DATE = LocalDate.of(2025, 4, 15);
    private static final LocalDate EXISTS_DATE_2 = LocalDate.of(2025, 4, 7);
    private static final LocalDate NOT_EXISTS_DATE = LocalDate.of(2025, 6, 10);
    private static final long DELETE_BORROW_ID = 1L;

    private static final int PAGE_SIZE = 5;
    private static final int TOTAL_BORROWS = 6;

    private static final String GAME_ID_PARAM = "gameId";
    private static final String CUSTOMER_ID_PARAM = "customerId";
    private static final String DATE_PARAM = "date";

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getUrlWithParams() {
        return UriComponentsBuilder.fromHttpUrl(LOCALHOST + port + SERVICE_PATH).queryParam(GAME_ID_PARAM, "{" + GAME_ID_PARAM + "}").queryParam(CUSTOMER_ID_PARAM, "{" + CUSTOMER_ID_PARAM + "}")
                .queryParam(DATE_PARAM, "{" + DATE_PARAM + "}").encode().toUriString();
    }

    ParameterizedTypeReference<ResponsePage<BorrowDto>> responseTypePage = new ParameterizedTypeReference<ResponsePage<BorrowDto>>() {
    };
    ParameterizedTypeReference<List<BorrowDto>> responseType = new ParameterizedTypeReference<List<BorrowDto>>() {
    };

    @Test
    public void findFirstPageWithFiveSizeShouldReturnFirstFiveResults() {

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response);
        assertEquals(TOTAL_BORROWS, response.getBody().getTotalElements());
        assertEquals(PAGE_SIZE, response.getBody().getContent().size());
    }

    @Test
    public void findSecondPageWithFiveSizeShouldReturnLastResult() {

        int elementsCount = TOTAL_BORROWS - PAGE_SIZE;

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(1, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response);
        assertEquals(TOTAL_BORROWS, response.getBody().getTotalElements());
        assertEquals(elementsCount, response.getBody().getContent().size());
    }

    @Test
    public void findWithoutFiltersShouldReturnAllBorrowsInDB() {
        int BORROWS_WITH_FILTER = 6;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), null);
        params.put((CUSTOMER_ID_PARAM), null);
        params.put((DATE_PARAM), null);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findExistsGameShouldReturnBorrows() {
        int BORROWS_WITH_FILTER = 1;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), null);
        params.put((DATE_PARAM), null);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

    }

    @Test
    public void findNotExistsGameShouldReturnEmpty() {
        int LOANS_WITH_FILTER = 0;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), NOT_EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), null);
        params.put((DATE_PARAM), null);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(LOANS_WITH_FILTER, response.getBody().getTotalElements());

    }

    @Test
    public void findExistsCustomerShouldReturnBorrows() {
        int LOANS_WITH_FILTER = 1;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), null);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), null);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(LOANS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findNotExistsCustomerShouldReturnEmpty() {
        int LOANS_WITH_FILTER = 0;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), null);
        params.put((CUSTOMER_ID_PARAM), NOT_EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), null);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(LOANS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findExistsDateShouldReturnBorrows() {

        int LOANS_WITH_FILTER = 1;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), null);
        params.put((CUSTOMER_ID_PARAM), null);
        params.put((DATE_PARAM), EXISTS_DATE);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(LOANS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findNotExistsDateShouldReturnEmpty() {

        int LOANS_WITH_FILTER = 0;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), null);
        params.put((CUSTOMER_ID_PARAM), null);
        params.put((DATE_PARAM), NOT_EXISTS_DATE);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(LOANS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findExistsGameAndCustomerShouldReturnBorrows() {

        int BORROWS_WITH_FILTER = 0;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), null);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

    }

    @Test
    public void findExistsGameAndDateShouldReturnBorrows() {
        int LOANS_WITH_FILTER = 1;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), null);
        params.put((DATE_PARAM), EXISTS_DATE_2);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(LOANS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findExistsCustomerAndDateShouldReturnBorrows() {
        int LOANS_WITH_FILTER = 1;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), null);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), EXISTS_DATE_2);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(LOANS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findExistsGameAndCustomerAndDateShouldReturnBorrows() {
        int BORROWS_WITH_FILTER = 0;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), EXISTS_DATE_2);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());
    }

    @Test
    public void findNotExistsGameOrCustomerOrDateShouldReturnEmpty() {

        int BORROWS_WITH_FILTER = 0;

        Map<String, Object> params = new HashMap<>();
        params.put((GAME_ID_PARAM), EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), NOT_EXISTS_DATE);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, PAGE_SIZE));
        ;

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

        params.put((GAME_ID_PARAM), EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), NOT_EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), NOT_EXISTS_DATE);

        response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

        params.put((GAME_ID_PARAM), EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), NOT_EXISTS_DATE);

        response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

        params.put((GAME_ID_PARAM), NOT_EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), EXISTS_DATE);

        response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

        params.put((GAME_ID_PARAM), NOT_EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), NOT_EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), EXISTS_DATE);

        response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

        params.put((GAME_ID_PARAM), NOT_EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), EXISTS_DATE);

        response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

        params.put((GAME_ID_PARAM), NOT_EXISTS_GAME_ID);
        params.put((CUSTOMER_ID_PARAM), NOT_EXISTS_CUSTOMER_ID);
        params.put((DATE_PARAM), NOT_EXISTS_DATE);

        response = restTemplate.exchange(getUrlWithParams(), HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage, params);

        assertNotNull(response);
        assertEquals(BORROWS_WITH_FILTER, response.getBody().getTotalElements());

    }

    @Test
    void deleteWithExistsIdShouldDeleteBorrow() {
        long newBorrowsSize = TOTAL_BORROWS - 1;

        restTemplate.exchange(LOCALHOST + port + SERVICE_PATH + "/" + DELETE_BORROW_ID, HttpMethod.DELETE, null, Void.class);

        BorrowSearchDto searchDto = new BorrowSearchDto();
        searchDto.setPageable(new PageableRequest(0, TOTAL_BORROWS));

        ResponseEntity<ResponsePage<BorrowDto>> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH, HttpMethod.POST, new HttpEntity<>(searchDto), responseTypePage);

        assertNotNull(response);
        assertEquals(newBorrowsSize, response.getBody().getTotalElements());
    }

    @Test
    public void deleteWithNotExistsIdShouldThrowException() {

        long deleteBorrowId = TOTAL_BORROWS + 1;

        ResponseEntity<?> response = restTemplate.exchange(LOCALHOST + port + SERVICE_PATH + "/" + deleteBorrowId, HttpMethod.DELETE, null, Void.class);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

}
