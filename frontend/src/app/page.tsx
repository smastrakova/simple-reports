import { Header } from '@/components/Header'
import PaginatedEntriesTable from '@/components/PaginatedReportsTable'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/mira/theme.css'

export default function Home() {
  return (
    <div>
      <main>
        <div>
          <Header />
          <PaginatedEntriesTable />
        </div>
      </main>
    </div>
  )
}
