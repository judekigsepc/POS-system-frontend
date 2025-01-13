
import Cart from "./Cart";
import DisplayCollections from "./DisplayCollections";
import DisplayProducts from "./DisplayProducts";

import { Tabs } from "flowbite-react";

function Sale () {
         return (
            <>
            <div className="grid grid-cols-[60%,40%] gap-1">
                <Tabs>
                    <Tabs.Item title="Products">
                    <DisplayProducts/>
                    </Tabs.Item>
                    <Tabs.Item title="Collections">
                    <DisplayCollections/>
                    </Tabs.Item>
                </Tabs>
                  
                <Cart/>
            </div>
            </>
         )
}

export default Sale