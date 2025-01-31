'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../styles/MinistryCreationForm.module.css'

interface MinistryFormData {
  MinistryName: string;
  description: string;
  Church_ID: number;
  Budget: number;
}

export default function MinistryCreationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<MinistryFormData>({
    MinistryName: '',
    description: '',
    Church_ID: 1, // We might want to make this dynamic later
    Budget: 0  // Make sure this is initialized as a number
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

      router.push('/ministries')
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
              name="description"
              placeholder="Ministry Description"
              value={formData.description}
              onChange={handleChange}
              className={styles.input}
              rows={4}
            />

            <input
              type="number"
              name="Budget"
              placeholder="Budget"
              value={formData.Budget}
              onChange={handleChange}
              className={styles.input}
              step="0.01"
              min="0"
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
