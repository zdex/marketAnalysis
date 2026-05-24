function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this with:
    // const res = await fetch("/api/v1/dashboard/home");
    // const json = await res.json();
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const refetch = () => {
    setLoading(true);
    setTimeout(() => { setData(MOCK_DATA); setLoading(false); }, 400);
  };

  return { data, loading, error, refetch };
}