"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { onboardingSchema, type OnboardingFormData } from "@/lib/schema"
import { submitOnboardingForm } from "../../lib/actions"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressBar } from "@/components/onboarding/progress-bar"
import { Confirmation } from "@/components/onboarding/confirmation"
import { Step1Brand } from "@/components/onboarding/steps/step-1-brand"
import { Step2Car } from "@/components/onboarding/steps/step-2-car"
import { Step3Photography } from "@/components/onboarding/steps/step-3-photography"
import { Step4Driver } from "@/components/onboarding/steps/step-4-driver"
import { Step5Team } from "@/components/onboarding/steps/step-5-team"
import { Step6Events } from "@/components/onboarding/steps/step-6-events"
import { Step7Faqs } from "@/components/onboarding/steps/step-7-faqs"
import { Step8Review } from "@/components/onboarding/steps/step-8-review"

const STEP_LABELS = ["Brand Assets", "Car Info", "Photography", "Driver", "Team & Staff", "Events", "FAQs", "Review"]

const TOTAL_STEPS = 8

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      lightBackgroundVersion: false,
      darkBackgroundVersion: false,
      plainWhiteBackground: false,
      multipleAngles: false,
      photographyTypes: [],
      tracks: [],
      experientialEvents: [],
      drivers: [
        {
          driverName: "",
          hometown: "",
          currentResidence: "",
          birthdate: "",
          instagram: "",
          facebook: "",
          twitter: "",
          tiktok: "",
          merchandiseStore: "",
          driverBio: "",
          headshot: undefined,
          heroImage: undefined,
        },
      ],
      ownership: [],
      staff: [],
      indycarOnly: false,
      includeIndycarNxt: false,
      acknowledgeScheduleSource: false,
      eventTypes: [],
      useDefaultFaqs: true,
      customFaqs: [],
      assetsApproved: false,
    },
    mode: "onChange",
  })

  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ["logos", "lightBackgroundVersion", "brandGuidelines"]
    } else if (currentStep === 4) {
      fieldsToValidate = ["drivers"]
    } else if (currentStep === 8) {
      fieldsToValidate = ["assetsApproved"]
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate)
      if (!isValid) return
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Calculate total file size in MB
  const calculateTotalFileSize = (data: OnboardingFormData): number => {
    let totalSize = 0
    
    const addFileSize = (file: File | File[] | null | undefined) => {
      if (!file) return
      if (Array.isArray(file)) {
        file.forEach(f => { if (f instanceof File) totalSize += f.size })
      } else if (file instanceof File) {
        totalSize += file.size
      }
    }
    
    // Add all file fields
    addFileSize(data.logos)
    addFileSize(data.brandGuidelines)
    addFileSize(data.carImages)
    addFileSize(data.eventPhotography)
    
    data.drivers?.forEach(driver => {
      addFileSize(driver.headshot)
      addFileSize(driver.heroImage)
    })
    
    data.tracks?.forEach(track => {
      addFileSize(track.trackImages)
    })
    
    data.experientialEvents?.forEach(event => {
      addFileSize(event.images)
    })
    
    data.ownership?.forEach(owner => {
      addFileSize(owner.headshot)
    })
    
    data.staff?.forEach(staff => {
      addFileSize(staff.headshot)
    })
    
    return totalSize / (1024 * 1024) // Convert to MB
  }

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true)
      
      // Check total payload size
      const totalSizeMB = calculateTotalFileSize(data)
      console.log(`Total file size: ${totalSizeMB.toFixed(2)}MB`)
      
      if (totalSizeMB > 9) { // Leave some headroom (10MB limit, warn at 9MB)
        const proceed = confirm(
          `Warning: Your total file size is ${totalSizeMB.toFixed(2)}MB, which is near the 10MB limit.\n\n` +
          `This may cause the submission to fail. Consider:\n` +
          `• Reducing image file sizes using compression\n` +
          `• Uploading fewer images\n` +
          `• Using lower resolution images\n\n` +
          `Do you want to try submitting anyway?`
        )
        
        if (!proceed) {
          setIsSubmitting(false)
          return
        }
      }
      
      // Log full payload to console
      console.log("Onboarding Form Submission:", data)

      // Submit to database
      const result = await submitOnboardingForm(data)

      if (result.success && result.referenceId) {
        setReferenceId(result.referenceId)
        setIsSubmitted(true)
      } else {
        // Handle error - you might want to show a toast notification
        console.error("Submission failed:", result.error)
        
        if (result.error?.includes("payload") || result.error?.includes("413") || result.error?.includes("too large")) {
          alert(
            "Upload failed: File size too large.\n\n" +
            `Total size: ${totalSizeMB.toFixed(2)}MB\n\n` +
            "Please reduce your file sizes and try again."
          )
        } else {
          alert("Failed to submit form. Please try again.")
        }
      }
    } catch (error) {
      console.error("Submission error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      if (errorMessage.includes("payload") || errorMessage.includes("413") || errorMessage.includes("too large")) {
        alert(
          "Upload failed: Total file size exceeds the limit.\n\n" +
          "Please compress your images or upload fewer files."
        )
      } else {
        alert("An error occurred while submitting the form. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    form.reset()
    setCurrentStep(1)
    setIsSubmitted(false)
    setReferenceId("")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Brand form={form} />
      case 2:
        return <Step2Car form={form} />
      case 3:
        return <Step3Photography form={form} />
      case 4:
        return <Step4Driver form={form} />
      case 5:
        return <Step5Team form={form} />
      case 6:
        return <Step6Events form={form} />
      case 7:
        return <Step7Faqs form={form} />
      case 8:
        return <Step8Review form={form} />
      default:
        return null
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6 sm:p-8">
          <Confirmation referenceId={referenceId} onReset={handleReset} />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} stepLabels={STEP_LABELS} />

      <Card className="border-border bg-card">
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {renderStep()}

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>

                {currentStep === TOTAL_STEPS ? (
                  <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext} className="gap-2">
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
