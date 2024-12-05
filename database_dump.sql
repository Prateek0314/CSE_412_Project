--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Homebrew)
-- Dumped by pg_dump version 15.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: coupon; Type: TABLE; Schema: public; Owner: prateekravindran
--

CREATE TABLE public.coupon (
    coupon_code character(6) NOT NULL,
    coupon_status boolean,
    discount_pct numeric(5,2),
    coupon_expiry date,
    coupon_usagelimit integer
);


ALTER TABLE public.coupon OWNER TO prateekravindran;

--
-- Name: customer_info; Type: TABLE; Schema: public; Owner: prateekravindran
--

CREATE TABLE public.customer_info (
    customer_id integer NOT NULL,
    gender character varying(6),
    location character varying(80),
    total_spent numeric(10,2),
    tenure_months integer
);


ALTER TABLE public.customer_info OWNER TO prateekravindran;

--
-- Name: product_info; Type: TABLE; Schema: public; Owner: prateekravindran
--

CREATE TABLE public.product_info (
    product_sku character(14) NOT NULL,
    product_description character varying(80),
    product_category character varying(20),
    item_price numeric(10,2),
    store_quantity integer
);


ALTER TABLE public.product_info OWNER TO prateekravindran;

--
-- Name: transaction_detail; Type: TABLE; Schema: public; Owner: prateekravindran
--

CREATE TABLE public.transaction_detail (
    transaction_id integer NOT NULL,
    product_sku character(14) NOT NULL,
    coupon_code character(6),
    tax_pct numeric(5,2),
    purchased_quantity integer
);


ALTER TABLE public.transaction_detail OWNER TO prateekravindran;

--
-- Name: transaction_info; Type: TABLE; Schema: public; Owner: prateekravindran
--

CREATE TABLE public.transaction_info (
    transaction_id integer NOT NULL,
    customer_id integer,
    transaction_date date DEFAULT CURRENT_DATE,
    delivery_charge numeric(10,2),
    products character(14)[],
    total_price numeric(10,2)
);


ALTER TABLE public.transaction_info OWNER TO prateekravindran;

--
-- Data for Name: coupon; Type: TABLE DATA; Schema: public; Owner: prateekravindran
--

COPY public.coupon (coupon_code, coupon_status, discount_pct, coupon_expiry, coupon_usagelimit) FROM stdin;
123456	t	0.50	2024-10-07	5
\.


--
-- Data for Name: customer_info; Type: TABLE DATA; Schema: public; Owner: prateekravindran
--

COPY public.customer_info (customer_id, gender, location, total_spent, tenure_months) FROM stdin;
102	M	Chicago	670.99	12
103	F	Phoenix	400.55	6
104	NB	Los Angeles	30.45	24
2	F	Los Angeles	1500.75	36
3	M	Chicago	600.25	12
\.


--
-- Data for Name: product_info; Type: TABLE DATA; Schema: public; Owner: prateekravindran
--

COPY public.product_info (product_sku, product_description, product_category, item_price, store_quantity) FROM stdin;
00000000000001	Pan	Kitchenware	26.60	100
00000000000002	Monitor	Computer	189.50	100
00000000000003	Cologne	Beauty	122.00	100
\.


--
-- Data for Name: transaction_detail; Type: TABLE DATA; Schema: public; Owner: prateekravindran
--

COPY public.transaction_detail (transaction_id, product_sku, coupon_code, tax_pct, purchased_quantity) FROM stdin;
111	00000000000001	123456	0.02	5
112	00000000000002	123456	0.02	1
113	00000000000003	123456	0.02	2
\.


--
-- Data for Name: transaction_info; Type: TABLE DATA; Schema: public; Owner: prateekravindran
--

COPY public.transaction_info (transaction_id, customer_id, transaction_date, delivery_charge, products, total_price) FROM stdin;
112	103	2024-10-08	10.99	{00000000000001,00000000000002,00000000000003}	200.50
113	104	2024-10-08	10.99	{00000000000001,00000000000002,00000000000003}	133.00
111	102	2024-08-20	5.00	{00000000000001,00000000000002,00000000000003}	120.75
\.


--
-- Name: coupon coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT coupon_pkey PRIMARY KEY (coupon_code);


--
-- Name: customer_info customer_info_pkey; Type: CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.customer_info
    ADD CONSTRAINT customer_info_pkey PRIMARY KEY (customer_id);


--
-- Name: product_info product_info_pkey; Type: CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.product_info
    ADD CONSTRAINT product_info_pkey PRIMARY KEY (product_sku);


--
-- Name: transaction_detail transaction_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_pkey PRIMARY KEY (transaction_id, product_sku);


--
-- Name: transaction_info transaction_info_pkey; Type: CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.transaction_info
    ADD CONSTRAINT transaction_info_pkey PRIMARY KEY (transaction_id);


--
-- Name: transaction_detail transaction_detail_coupon_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_coupon_code_fkey FOREIGN KEY (coupon_code) REFERENCES public.coupon(coupon_code);


--
-- Name: transaction_detail transaction_detail_product_sku_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_product_sku_fkey FOREIGN KEY (product_sku) REFERENCES public.product_info(product_sku);


--
-- Name: transaction_detail transaction_detail_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transaction_info(transaction_id);


--
-- Name: transaction_info transaction_info_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prateekravindran
--

ALTER TABLE ONLY public.transaction_info
    ADD CONSTRAINT transaction_info_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer_info(customer_id);


--
-- PostgreSQL database dump complete
--

