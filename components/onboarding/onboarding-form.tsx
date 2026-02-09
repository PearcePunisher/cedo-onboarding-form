"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { upload } from "@vercel/blob/client"
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

const DRAFT_STORAGE_KEY = "cedo-onboarding-draft"

type OnboardingFormProps = {
  enableDraft?: boolean
}

type UploadableFile = File | string
type UploadableSingle = UploadableFile | null | undefined
type UploadableMany = UploadableFile[] | null | undefined

export function OnboardingForm({ enableDraft = false }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("")

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      lightBackgroundVersion: false,
      darkBackgroundVersion: false,
      plainWhiteBackground: false,
      multipleAngles: false,
      photographyTypes: [],
      photographyTypeAssets: [],
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
      selectedSeries: [],
      indycarOnly: false,
      includeIndycarNxt: false,
      acknowledgeScheduleSource: false,
      f1IncludeSupportSeries: false,
      f1IncludeSprint: false,
      f1AcknowledgeScheduleSource: false,
      imsaIncludeMichelinPilot: false,
      imsaWeatherTechOnly: false,
      imsaAcknowledgeScheduleSource: false,
      nascarIncludeXfinity: false,
      nascarIncludeTruckSeries: false,
      nascarAcknowledgeScheduleSource: false,
      nhraIncludeSportsman: false,
      nhraProOnly: false,
      nhraAcknowledgeScheduleSource: false,
      eventTypes: [],
      useDefaultFaqs: true,
      customFaqs: [],
      assetsApproved: false,
    },
    mode: "onChange",
  })

  const sanitizeDraftData = (data: OnboardingFormData): OnboardingFormData => {
    const stripFileFields = <T extends Record<string, any>>(items: T[] | undefined, keys: (keyof T)[]) =>
      items?.map((item) => {
        const copy = { ...item }
        keys.forEach((key) => {
          if (key in copy) copy[key] = undefined
        })
        return copy as T
      }) ?? []

    return {
      ...data,
      logos: [],
      brandGuidelines: undefined,
      carImages: [],
      eventPhotography: [],
      photographyTypeAssets: data.photographyTypeAssets?.map((asset) => ({ type: asset.type, files: [] })) ?? [],
      drivers: stripFileFields(data.drivers, ["headshot", "heroImage"]),
      tracks: stripFileFields(data.tracks, ["trackImages"]),
      experientialEvents: stripFileFields(data.experientialEvents, ["images"]),
      ownership: stripFileFields(data.ownership, ["headshot"]),
      staff: stripFileFields(data.staff, ["headshot"]),
    }
  }

  const saveDraft = (options?: { silent?: boolean }) => {
    if (!enableDraft || typeof window === "undefined") return

    const draft = {
      data: sanitizeDraftData(form.getValues()),
      currentStep,
      savedAt: new Date().toISOString(),
    }

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    if (!options?.silent) {
      alert("Your progress has been saved. You can safely return later to continue.")
    }
  }

  useEffect(() => {
    if (!enableDraft || typeof window === "undefined") return

    const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!rawDraft) return

    try {
      const parsed = JSON.parse(rawDraft) as { data?: OnboardingFormData; currentStep?: number; savedAt?: string }
      if (!parsed?.data) return

      const shouldRestore = confirm(
        parsed.savedAt
          ? `We found a saved draft from ${new Date(parsed.savedAt).toLocaleString()}. Continue where you left off?`
          : "We found a saved draft. Continue where you left off?"
      )

      if (shouldRestore) {
        form.reset(parsed.data)
        setCurrentStep(parsed.currentStep ?? 1)
      }
    } catch (error) {
      console.error("Failed to load saved draft", error)
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    }
  }, [enableDraft, form])

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

    // Save progress before advancing to ensure previous step data is persisted
    saveDraft({ silent: true })

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      // Save current state before moving back
      saveDraft({ silent: true })
      setCurrentStep((prev) => prev - 1)
    }
  }

  const generateReferenceId = () =>
    `CEDO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  const countFilesToUpload = (data: OnboardingFormData): number => {
    let count = 0

    const addFiles = (file: UploadableSingle | UploadableMany) => {
      if (!file) return
      if (Array.isArray(file)) {
        file.forEach((item) => {
          if (item instanceof File) count += 1
        })
        return
      }
      if (file instanceof File) count += 1
    }

    addFiles(data.logos)
    addFiles(data.brandGuidelines)
    addFiles(data.carImages)
    addFiles(data.eventPhotography)
    data.photographyTypeAssets?.forEach((asset) => addFiles(asset.files))
    data.drivers?.forEach((driver) => {
      addFiles(driver.headshot)
      addFiles(driver.heroImage)
    })
    data.tracks?.forEach((track) => addFiles(track.trackImages))
    data.experientialEvents?.forEach((event) => addFiles(event.images))
    data.ownership?.forEach((owner) => addFiles(owner.headshot))
    data.staff?.forEach((member) => addFiles(member.headshot))

    return count
  }

  const uploadFormFiles = async (data: OnboardingFormData, submissionReferenceId: string): Promise<OnboardingFormData> => {
    const totalFiles = countFilesToUpload(data)
    let uploadedFiles = 0

    const uploadSingle = async (file: UploadableSingle, prefix: string): Promise<string | null> => {
      if (!file) return null
      if (typeof file === "string") return file
      if (!(file instanceof File)) return null

      setUploadStatus(`Uploading file ${uploadedFiles + 1} of ${totalFiles}: ${file.name}`)
      const safeFileName = file.name.replace(/[^\w.-]+/g, "-")
      const pathName = `${prefix}/${Date.now()}-${safeFileName}`
      const blob = await upload(pathName, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        multipart: file.size > 8 * 1024 * 1024,
      })
      uploadedFiles += 1
      return blob.url
    }

    const uploadMany = async (files: UploadableMany, prefix: string): Promise<string[]> => {
      if (!files || files.length === 0) return []
      const urls: string[] = []
      for (const file of files) {
        const url = await uploadSingle(file, prefix)
        if (url) urls.push(url)
      }
      return urls
    }

    return {
      ...data,
      logos: await uploadMany(data.logos, `onboarding/${submissionReferenceId}/logos`),
      brandGuidelines: await uploadSingle(data.brandGuidelines, `onboarding/${submissionReferenceId}/brand-guidelines`),
      carImages: await uploadMany(data.carImages, `onboarding/${submissionReferenceId}/car-images`),
      eventPhotography: await uploadMany(data.eventPhotography, `onboarding/${submissionReferenceId}/event-photography`),
      photographyTypeAssets:
        (await Promise.all(
          (data.photographyTypeAssets ?? []).map(async (asset) => ({
            ...asset,
            files: await uploadMany(asset.files, `onboarding/${submissionReferenceId}/photography/${asset.type}`),
          })),
        )) ?? [],
      drivers:
        (await Promise.all(
          (data.drivers ?? []).map(async (driver) => ({
            ...driver,
            headshot: await uploadSingle(driver.headshot, `onboarding/${submissionReferenceId}/drivers/headshots`),
            heroImage: await uploadSingle(driver.heroImage, `onboarding/${submissionReferenceId}/drivers/hero-images`),
          })),
        )) ?? [],
      tracks:
        (await Promise.all(
          (data.tracks ?? []).map(async (track) => ({
            ...track,
            trackImages: await uploadMany(track.trackImages, `onboarding/${submissionReferenceId}/tracks`),
          })),
        )) ?? [],
      experientialEvents:
        (await Promise.all(
          (data.experientialEvents ?? []).map(async (event) => ({
            ...event,
            images: await uploadMany(event.images, `onboarding/${submissionReferenceId}/experiential-events`),
          })),
        )) ?? [],
      ownership:
        (await Promise.all(
          (data.ownership ?? []).map(async (owner) => ({
            ...owner,
            headshot: await uploadSingle(owner.headshot, `onboarding/${submissionReferenceId}/ownership`),
          })),
        )) ?? [],
      staff:
        (await Promise.all(
          (data.staff ?? []).map(async (member) => ({
            ...member,
            headshot: await uploadSingle(member.headshot, `onboarding/${submissionReferenceId}/staff`),
          })),
        )) ?? [],
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
    data.photographyTypeAssets?.forEach((asset) => addFileSize(asset.files))
    
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
      const totalSizeMB = calculateTotalFileSize(data)
      console.log(`Total file size: ${totalSizeMB.toFixed(2)}MB`)

      const submissionReferenceId = generateReferenceId()
      const totalFiles = countFilesToUpload(data)
      if (totalFiles > 0) {
        setUploadStatus(`Preparing ${totalFiles} files for upload...`)
      } else {
        setUploadStatus("Submitting form data...")
      }

      const preparedData = await uploadFormFiles(data, submissionReferenceId)

      setUploadStatus("Finalizing submission...")
      const result = await submitOnboardingForm(preparedData, submissionReferenceId)

      if (result.success && result.referenceId) {
        setReferenceId(result.referenceId)
        setIsSubmitted(true)
        if (enableDraft && typeof window !== "undefined") {
          localStorage.removeItem(DRAFT_STORAGE_KEY)
        }
      } else {
        console.error("Submission failed:", result.error)
        alert("Failed to submit form. Please try again.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      alert("An error occurred while uploading files or submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
      setUploadStatus("")
    }
  }

  const handleReset = () => {
    form.reset()
    setCurrentStep(1)
    setIsSubmitted(false)
    setReferenceId("")
    if (enableDraft && typeof window !== "undefined") {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    }
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

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    className="gap-2"
                    disabled={!enableDraft}
                  >
                    Save & Continue Later
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
              </div>
              {isSubmitting && uploadStatus ? <p className="mt-3 text-sm text-muted-foreground">{uploadStatus}</p> : null}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
