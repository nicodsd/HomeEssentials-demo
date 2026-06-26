import React, { useEffect } from 'react';
import { Link as Anchor } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import categories_actions from '../../../store/actions/categories';

const HomeCategory = () => {
  const { categories_read } = categories_actions;
  const dispatch = useDispatch();
  const categories = useSelector(store => store.categories.categories || []);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(categories_read());
    }
  }, [dispatch, categories.length, categories_read]);

  return (
    <div className="h-fit min-h-[10vh] w-full p-4 md:p-24 lg:w-[85%] flex flex-col items-center">
      <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 md:gap- gap-y-7 justify-items-center">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col items-center text-center w-full group"
          >
            <Anchor
              to={`/allproducts/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative w-[4.6rem] h-[4.6rem] sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-50 group-hover:scale-110"
                src={cat.coverPhoto}
                alt={cat.name}
              />
            </Anchor>

            <div className="mt-1 w-full flex items-start justify-center">
              <h3 className="text-xs sm:text-sm text-black transition-colors leading-tight line-clamp-2">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
        <div className="flex flex-col items-center text-center w-full group">
          <Anchor to="/allproducts" className="relative w-[4.6rem] h-[4.6rem] sm:w-32 sm:h-32 bg-[#000000] text-white flex text-xs md:text-md items-center font-semibold justify-center rounded-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-50 transform group-hover:bg-black/80">
            Explore All Products
          </Anchor>
        </div>
      </div>
    </div>
  );
};

export default HomeCategory;