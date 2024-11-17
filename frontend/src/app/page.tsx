import { Header } from '@/components/Header'
import PaginatedEntriesTable from '@/components/PaginatedReportsTable'
import { DialogProvider } from '@/providers/dialogContextProvider'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/mira/theme.css'

export default function Home() {
  return (
    <div>
      <main>
        <div>
          <DialogProvider>
            <Header />
            <PaginatedEntriesTable />
          </DialogProvider>
        </div>
      </main>
    </div>
  )
}
