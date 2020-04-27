import React, { useEffect, useState, useReducer } from 'react';
import axios from 'axios';
import { Box, Container, ThemeProvider } from 'theme-ui';
import theme from './theme';
import Header from './components/Header';
import Search from './components/Search';
import Table from './components/Table';
import { ButtonWithLoading } from './components/Button';

const DEFAULT_QUERY = 'react';
const DEFAULT_HPP = '100';

function App() {
  const [query, setQuery] = useState('redux');
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    `https://hn.algolia.com/api/v1/search?query=${DEFAULT_QUERY}&page=0&hitsPerPage=${DEFAULT_HPP}`,
    {
      hits: [],
    },
  );

  const { page, nbPages } = data;

  return (
    <ThemeProvider theme={theme}>
      <Container p={1}>
        <Header>
          <Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSubmit={(event) => {
              doFetch(
                `http://hn.algolia.com/api/v1/search?query=${query}&page=0&hitsPerPage=${DEFAULT_HPP}`,
              );
              event.preventDefault();
            }}
          >
            Search
          </Search>
        </Header>
        <div>
          {isError ? <p>Something went wrong.</p> : <Table list={data.hits} />}
          <Box sx={{ textAlign: 'center', my: 2 }}>
            {(isLoading || !page < nbPages) && (
              <ButtonWithLoading
                isLoading={isLoading}
                onClick={() => {
                  doFetch(
                    `http://hn.algolia.com/api/v1/search?query=${query}&page=${
                      page + 1
                    }&hitsPerPage=${DEFAULT_HPP}`,
                  );
                }}
                className="button"
              >
                More
              </ButtonWithLoading>
            )}
          </Box>
        </div>
      </Container>
    </ThemeProvider>
  );
}

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT': {
      const data = action.refresh ? { hits: [] } : state.data;

      return {
        ...state,
        data,
        isLoading: true,
        isError: false,
      };
    }
    case 'FETCH_SUCCESS': {
      let data;
      const { payload } = action;
      if (payload.page === 0) {
        data = payload;
      } else {
        const updatedHits = [...state.data.hits, ...payload.hits];
        data = { ...payload, ...{ hits: updatedHits } };
      }

      return {
        ...state,
        data,
        isLoading: false,
        isError: false,
      };
    }
    case 'FETCH_FAILURE': {
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    }
    default:
      throw new Error();
  }
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT', refresh: -1 !== url.indexOf('page=0') });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

export default App;
