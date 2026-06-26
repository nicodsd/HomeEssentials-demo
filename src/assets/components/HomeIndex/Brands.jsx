import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import manufacturers_action from '../../../store/actions/manufacturers';

const Brands = () => {
  const { manufacturers_read } = manufacturers_action;
  const dispatch = useDispatch();
  const manufacturers = useSelector(store => store.manufacturerHome.manufacturers || []);

  useEffect(() => {
    if (manufacturers.length === 0) {
      dispatch(manufacturers_read());
    }
  }, [dispatch, manufacturers.length, manufacturers_read]);

  return (
    <div className="bg-white w-[85%] flex flex-col mx-auto items-center">
      <div className='overflow-hidden flex w-full py-10 relative mask-gradient group'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='flex shrink-0 gap-4 px-2 animate-marquee group-hover:[animation-play-state:paused]'>
            {manufacturers.map((brand, index) => (
              <div key={`${brand._id}-${index}`} className="flex-shrink-0">
                <img
                  className="rounded-full md:w-20 md:h-20 w-12 h-12 object-cover hover:scale-105 transition-transform duration-300"
                  src={brand.logo}
                  alt={brand.name || "brand"}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;