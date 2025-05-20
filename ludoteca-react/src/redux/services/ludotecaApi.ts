import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Game } from "../../types/Game";
import type{ Category } from "../../types/Category";
import type { Author, AuthorResponse } from "../../types/Author";
import type { Customer } from "../../types/Customer";
import type { Borrow, BorrowResponse } from "../../types/Borrow";


export const ludotecaAPI = createApi({
  reducerPath: "ludotecaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
  }),
  tagTypes: ["Category", "Author", "Game", "Customer", "Borrow"],
  endpoints: (builder) => ({

    //Categorias
    getCategories: builder.query<Category[], null>({
      query: () => "category",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/category",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (payload: Category) => ({
        url: `category/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),

    //Autores
     getAllAuthors: builder.query<Author[], null>({
      query: () => "author",
      providesTags: ["Author"],
    }),
    getAuthors: builder.query<
      AuthorResponse,
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber, pageSize }) => {
        return {
          url: "author",
          method: "POST",
          body: {
            pageable: {
              pageNumber,
              pageSize,
            },
          },
        };
      },
      providesTags: ["Author"],
    }),
    createAuthor: builder.mutation({
      query: (payload) => ({
        url: "/author",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Author"],
    }),
    deleteAuthor: builder.mutation({
      query: (id: string) => ({
        url: `/author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),
    updateAuthor: builder.mutation({
      query: (payload: Author) => ({
        url: `author/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Author", "Game"],
    }),

   // Juegos
    getAllGames: builder.query<Game[], null>({
      query: () => "game",
      providesTags: ["Game"],
    }),
    getGames: builder.query<Game[], { title: string; idCategory: string }>({
      query: ({ title, idCategory }) => {
        return {
          url: "/game",
          params: { title, idCategory },
        };
      },
      providesTags: ["Game"],
    }),
    createGame: builder.mutation({
      query: (payload: Game) => ({
        url: "/game",
        method: "PUT",
        body: { ...payload },
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Game"],
    }),
    updateGame: builder.mutation({
      query: (payload: Game) => ({
        url: `game/${payload.id}`,
        method: "PUT",
        body: { ...payload },
      }),
      invalidatesTags: ["Game"],
    }),

    //Clientes
    getCustomers: builder.query<Customer[], null>({
      query: () => "customer",
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation({
      query: (payload) => ({
        url: "/customer",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCustomer: builder.mutation({
      query: (id: string) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation({
      query: (payload: Customer) => ({
        url: `customer/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),

     //Préstamos
    getBorrow: builder.query<Borrow[], null>({
      query: () => "borrow",
      providesTags: ["Borrow"],
    }),
    createBorrow: builder.mutation({
      query: (payload) => ({
        url: "/borrow",
        method: "PUT",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Borrow"],
    }),
    deleteBorrow: builder.mutation({
      query: (id: string) => ({
        url: `/borrow/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Borrow"],
    }),
    updateBorrow: builder.mutation({
      query: (payload: Borrow) => ({
        url: `borrow/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Borrow"],
    }),
    getBorrowsByPage: builder.query<BorrowResponse, { pageNumber: number; pageSize: number; idGame?: string; idCustomer?: string; date?: string }>({
      query: ({ pageNumber, pageSize, idGame, idCustomer, date }) => {
        return {
          url: "/loan",
          method: "POST",
          params: { 
            idGame, 
            idCustomer, 
            date: date ? date : undefined },
          body: {
            pageable: { pageNumber, pageSize },
          },
        };
      },
      providesTags: ["Borrow"],
    }),

 
  }),
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useCreateAuthorMutation,
  useDeleteAuthorMutation,
  useGetAllAuthorsQuery,
  useGetAuthorsQuery,
  useUpdateAuthorMutation,
  useCreateGameMutation,
  useGetGamesQuery,
  useUpdateGameMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
  useCreateBorrowMutation,
  useGetBorrowQuery,
  useUpdateBorrowMutation,
  useDeleteBorrowMutation,
  useGetBorrowsByPageQuery
} = ludotecaAPI;