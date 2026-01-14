"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { onboardingSchema, type OnboardingFormData } from "@/lib/schema"
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

    if (currentStep === 4) {
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

  const onSubmit = (data: OnboardingFormData) => {
    // Log full payload to console
    console.log("Onboarding Form Submission:", data)

    // Generate mock reference ID
    const mockRefId = `CEDO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    setReferenceId(mockRefId)
    setIsSubmitted(true)

    // Placeholder for webhook / Strapi integration
    // TODO: POST to /api/onboarding
    // fetch('/api/onboarding', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
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
                  <Button type="submit" className="gap-2">
                    Submit
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
