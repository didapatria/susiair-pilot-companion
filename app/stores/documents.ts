import documentsJson from '~/assets/data/mock-documents.json'
import type { DocumentsFile, PilotDocument } from '~/types/data'
import type { Tone } from '~/utils/status'

export interface DocumentView extends PilotDocument {
  daysRemaining: number
  tone: Tone
}

export const useDocumentsStore = defineStore('documents', () => {
  const data = ref<DocumentsFile | null>(null)
  const status = ref<'idle' | 'loading' | 'ready'>('idle')

  async function load() {
    if (status.value !== 'idle') return
    status.value = 'loading'
    await delay(400)
    data.value = documentsJson as DocumentsFile
    status.value = 'ready'
  }

  /** Most-urgent first; thresholds come from the JSON, not constants. */
  const documents = computed<DocumentView[]>(() => {
    if (!data.value) return []
    const { warningDays } = data.value.thresholds
    return data.value.documents
      .map((d) => {
        const daysRemaining = diffDays(d.expiryDate, APP_TODAY)
        return { ...d, daysRemaining, tone: documentTone(daysRemaining, warningDays) }
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
  })

  /** Notification-bell badge: expired + expiring-soon documents. */
  const alertCount = computed(() => documents.value.filter(d => d.tone !== 'success').length)

  return { data, status, load, documents, alertCount }
})
