import { Sidebar } from "flowbite-react";
import { HiAdjustments, HiCash, HiChartPie, HiDocumentReport,  HiLogout, HiShoppingBag, HiSupport } from "react-icons/hi";

import { Link } from "react-router-dom";

 function Nav() {
  return (
    <div>
<Sidebar aria-label="Side Bar">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item  icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
      

          <Sidebar.Collapse icon={HiCash} label="POS">

            <Sidebar.Item>
              <Link to='/sale'>New Sale</Link>
            </Sidebar.Item>

            <Sidebar.Item >Held Sales</Sidebar.Item>
          </Sidebar.Collapse>


          <Sidebar.Collapse icon={HiShoppingBag} label="Products">
            
            <Sidebar.Item><Link to='/products/add'>Add Products</Link></Sidebar.Item>
            <Sidebar.Item><Link to='/products/stock'>Stock Management</Link></Sidebar.Item>
            <Sidebar.Item><Link to='/products/collections'>Collection Management</Link></Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Collapse icon={HiDocumentReport} label="Reporting">
            <Sidebar.Item >Sales Summary</Sidebar.Item>
            <Sidebar.Item>Sales History</Sidebar.Item>
            <Sidebar.Item>Performance Report</Sidebar.Item>
            <Sidebar.Item>Audit Trail</Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Collapse icon={HiAdjustments} label="Settings">
            <Sidebar.Item >Configuration</Sidebar.Item>
            <Sidebar.Item >User management</Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Item icon={HiSupport}>
            Support
          </Sidebar.Item>

          <Sidebar.Item icon={HiLogout}>
            Check out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </div>
    
  );
}

export default Nav
