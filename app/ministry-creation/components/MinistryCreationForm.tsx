'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import styles from '../styles/MinistryCreationForm.module.css'

interface MinistryFormData {
  MinistryName: string;
  Church_ID: number | null;
  Description: string;
}

export default function MinistryCreationForm() {
  const router = useRouter()
  const { user } = useUser()
  const [formData, setFormData] = useState<MinistryFormData>({
    MinistryName: '',
    Description: '',
    Church_ID: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch user's church ID when component mounts
  useEffect(() => {
    const fetchUserChurch = async () => {
      if (!user?.sub) return;

      try {
        const response = await fetch('/api/userChurch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ auth0_id: user.sub }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user church');
        }

        const data = await response.json();
        if (data.length > 0) {
          setFormData(prev => ({
            ...prev,
            Church_ID: data[0].church_id
          }));
        } else {
          setError('You must be associated with a church to create a ministry');
        }
      } catch (error) {
        console.error('Error fetching user church:', error);
        setError('Failed to fetch church information');
      }
    };

    fetchUserChurch();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.Church_ID) {
      setError('You must be associated with a church to create a ministry');
      return;
    }

    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      console.log('Submitting form data:', formData)

      const response = await fetch('/api/ministries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Response received:', data)
      
      if (!response.ok) {
        console.log('Error response:', {
          status: response.status,
          statusText: response.statusText,
          data
        })
        throw new Error(data.details || data.error || 'Failed to create ministry')
      }

      // Show success message
      setSuccess('Ministry created successfully! Redirecting...')
      
      // First refresh to update the TopNav
      router.refresh()
      
      // Wait a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 1500))
      
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

  if (!user) {
    return (
      <div className={styles.container}>
        <div className="text-center text-red-500">
          Please log in to create a ministry
        </div>
      </div>
    );
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

          {success && (
            <div className="text-green-500 mb-4 text-center font-semibold">
              {success}
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
              disabled={isLoading}
            />

            <textarea
              name="Description"
              placeholder="Ministry Description"
              value={formData.Description}
              onChange={handleChange}
              className={styles.input}
              rows={4}
              disabled={isLoading}
            />

            <button
              type="submit"
              className={`${styles.button} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || !formData.Church_ID}
            >
              {isLoading ? 'Creating...' : 'Create Ministry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
