import { useState, useCallback, useRef, useEffect} from "react";

export const useHttpClient = () => {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);


  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {} ) => {

      setIsloading(true);
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal:httpAbortController.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl)=>{return reqCtrl !== httpAbortController});

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsloading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsloading(false);
        throw err;
      }
    },[]);

  const clearError = ()=>{
      setError(null);
  };

  useEffect(()=>{
      return ()=>{ activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abort()); }
  },[]);

  return { isLoading, error, sendRequest, clearError };
};
