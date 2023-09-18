import Layout from "./components/Layout";
import Link from "next/link";

export default function Products() {
     return <Layout>
        <Link href="/products/new" className="bg-gray-200 text-gray-700 rounded-md py-1 px-2">
            Add New Products
        </Link>
     </Layout>
}