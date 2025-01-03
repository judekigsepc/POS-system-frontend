
import Cart from "./Cart";
import DisplayProducts from "./DisplayProducts";

function Sale () {
         return (
            <>
            <div className="grid grid-cols-[60%,40%] gap-1">
                <DisplayProducts/>
                <Cart/>
            </div>
            </>
         )
}

export default Sale