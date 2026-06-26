import React, { useState } from "react";
import apiUrl from "../../../../api";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchQueryChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
    } else {
      handleSearch(query);
    }
  };

  const handleSearch = async (query) => {
    const currentQuery = query !== undefined ? query : searchQuery;
    if (!currentQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}products/search?searchQuery=${currentQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
    }
  };

  const showOverflowScroll = searchResults.length > 0;

  return (
    <>
      <div className="flex h-full flex-col relative w-full md:max-w-xl">
        <div className="flex h-full justify-center w-full">
          <input
            type="text"
            placeholder="Search..."
            className="rounded-l-xl bg-[#EDECEC] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-transparent px-4 py-2 flex-1 text-sm"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <button className="bg-[#7847E0] hover:bg-[#8450f4] text-white rounded-r-xl px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>

        {showOverflowScroll && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl overflow-y-auto max-h-[300px] z-50 flex flex-col divide-y divide-slate-100 animate-fadeIn">
            {searchResults.map((product) => (
              <div
                onClick={() => {
                  navigate(`/products/${product._id}`);
                  setSearchResults([]);
                  setSearchQuery("");
                }}
                key={product._id}
                className="cursor-pointer hover:bg-slate-50 p-3 flex items-center gap-4 transition-colors"
              >
                <img
                  src={product.photo}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                />
                <div className="flex flex-col justify-center flex-grow min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 truncate text-start">{product.name}</h3>
                  <p className="text-xs font-bold text-[#7847E0] mt-0.5 text-start">
                    {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
