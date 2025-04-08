'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/MinistryCreationForm.module.css'

interface MinistryFormData {
  MinistryName: string;
  Church_ID: number;
  Description: string;
}

export default function MinistryCreationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<MinistryFormData>({
    MinistryName: '',
    Description: '',
    Church_ID: 1, // We might want to make this dynamic later
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      console.log('Submitting form data:', formData) // Log the data being sent

      const response = await fetch('/api/ministries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Response received:', data) // Log the response
      
      if (!response.ok) {
        console.log('Error response:', {
          status: response.status,
          statusText: response.statusText,
          data
        })
        throw new Error(data.details || data.error || 'Failed to create ministry')
      }

      // First refresh to update the TopNav
      router.refresh()
      
      // Then redirect to the new ministry's homepage using its ID
      router.push(`/ministry/${data.ministryId}`)
      
      // Additional refresh after navigation to ensure everything is updated
      router.refresh()
    } catch (error) {
      console.error('Submission error:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      setError(error instanceof Error ? error.message : 'Failed to create ministry')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Create New Ministry</h1>
      </div>
      
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Ministry Details</h2>
          
          {error && (
            <div className="text-red-500 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="MinistryName"
              placeholder="Ministry Name"
              value={formData.MinistryName}
              onChange={handleChange}
              required
              className={styles.input}
            />

            <textarea
              name="Description"
              placeholder="Ministry Description"
              value={formData.Description}
              onChange={handleChange}
              className={styles.input}
              rows={4}
            />

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Ministry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
