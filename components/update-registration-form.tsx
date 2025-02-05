"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface UpdateRegistrationFormProps {
  initialData: any
}

export function UpdateRegistrationForm({ initialData }: UpdateRegistrationFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTeamMemberChange = (index: number, field: string, value: string | string[]) => {
    const updatedTeamMembers = [...formData.teamMembers]
    updatedTeamMembers[index] = { ...updatedTeamMembers[index], [field]: value }
    setFormData(prev => ({ ...prev, teamMembers: updatedTeamMembers }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/update-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registration Updated",
          description: "Your team registration has been updated successfully!",
          duration: 5000,
        })
        //onSubmit()
      } else {
        throw new Error(data.message || 'Registration update failed')
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const states = [
    "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan",
    "Pahang", "Perak", "Perlis", "Pulau Pinang", "Sabah",
    "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur",
    "Labuan", "Putrajaya"
  ]

  const races = [
    "Melayu", "Cina", "India", "Iban", "Bidayuh", "Melanau",
    "Kayan", "Kenyah", "Kelabit", "Lun Bawang", "Bisaya",
    "Kajang", "Penan", "Lain-lain bumiputra", "Lain-lain kaum"
  ]

  const grades = [
    "Primary 6 (12 years old)", "Primary 5 (11 years old)",
    "Primary 4 (10 years old)", "Form 1 (13 years old)",
    "Form 2 (14 years old)", "Form 3 (15 years old)"
  ]

  const codingExperiences = [
    "None", "Scratch", "Mblock", "Python", "JavaScript", "HTML/CSS", "Other"
  ]

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold">Update Registration</h2>
        <p className="text-sm text-gray-600">National Junior Hackathon Year 2024</p>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)] px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="Enter team name"
              value={formData.teamName}
              onChange={(e) => handleChange('teamName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Representing School?</Label>
            <RadioGroup
              value={formData.representingSchool}
              onValueChange={(value) => handleChange('representingSchool', value)}
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="school-yes" />
                <Label htmlFor="school-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="school-no" />
                <Label htmlFor="school-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.representingSchool === 'yes' && (
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                placeholder="Enter school name"
                value={formData.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                required
              />
              <Label htmlFor="schoolAddress">School Address</Label>
              <Input
                id="schoolAddress"
                placeholder="Enter school address"
                value={formData.schoolAddress}
                onChange={(e) => handleChange('schoolAddress', e.target.value)}
                required
              />
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="Enter postal code"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Education Level</Label>
            <RadioGroup
              value={formData.educationLevel}
              onValueChange={(value) => handleChange('educationLevel', value)}
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="primary" id="primary" />
                <Label htmlFor="primary">Primary School</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="secondary" id="secondary" />
                <Label htmlFor="secondary">Secondary School</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Which category will the team be participating?</Label>
            <RadioGroup
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="junior-scratch" id="junior-scratch" />
                <Label htmlFor="junior-scratch">Junior Scratch (Primary school)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="senior-scratch" id="senior-scratch" />
                <Label htmlFor="senior-scratch">Senior Scratch (Secondary school)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="senior-html" id="senior-html" />
                <Label htmlFor="senior-html">Senior HTML/CSS (Secondary school)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleChange('state', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state.toLowerCase()}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Team Member</Label>
            <div className="space-y-2 p-4 border rounded">
              <Label>Team Member 1</Label>
              <Input
                placeholder="Student Name"
                value={formData.teamMembers[0].name}
                onChange={(e) => handleTeamMemberChange(0, 'name', e.target.value)}
                required
              />
              <Input
                placeholder="IC Number"
                value={formData.teamMembers[0].ic}
                onChange={(e) => handleTeamMemberChange(0, 'ic', e.target.value)}
                required
              />
              <Select
                value={formData.teamMembers[0].gender}
                onValueChange={(value) => handleTeamMemberChange(0, 'gender', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.teamMembers[0].race}
                onValueChange={(value) => handleTeamMemberChange(0, 'race', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Race" />
                </SelectTrigger>
                <SelectContent>
                  {races.map((race) => (
                    <SelectItem key={race} value={race.toLowerCase()}>
                      {race}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.teamMembers[0].grade}
                onValueChange={(value) => handleTeamMemberChange(0, 'grade', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade.toLowerCase()}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="School's Name"
                value={formData.teamMembers[0].schoolName}
                onChange={(e) => handleTeamMemberChange(0, 'schoolName', e.target.value)}
                required
              />
              <Input
                placeholder="Parent's/Guardian's Name"
                value={formData.teamMembers[0].parentName}
                onChange={(e) => handleTeamMemberChange(0, 'parentName', e.target.value)}
                required
              />
              <Input
                type="tel"
                placeholder="Parent's/Guardian's Mobile Number"
                value={formData.teamMembers[0].parentPhone}
                onChange={(e) => handleTeamMemberChange(0, 'parentPhone', e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Parent's/Guardian's Email"
                value={formData.teamMembers[0].parentEmail}
                onChange={(e) => handleTeamMemberChange(0, 'parentEmail', e.target.value)}
                required
              />
              <Select
                value={formData.teamMembers[0].codingExperience}
                onValueChange={(value) => handleTeamMemberChange(0, 'codingExperience', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Coding Experience" />
                </SelectTrigger>
                <SelectContent>
                  {codingExperiences.map((exp) => (
                    <SelectItem key={exp} value={exp.toLowerCase()}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Teacher/Mentor Information</Label>
            <Input
              placeholder="Teacher Name"
              value={formData.teacherName}
              onChange={(e) => handleChange('teacherName', e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Teacher Email"
              value={formData.teacherEmail}
              onChange={(e) => handleChange('teacherEmail', e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder="Teacher Phone"
              value={formData.teacherPhone}
              onChange={(e) => handleChange('teacherPhone', e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleChange('agreeToTerms', checked)}
              required
            />
            <Label htmlFor="terms">
              I agree to the terms and conditions
            </Label>
          </div>
        </form>
      </ScrollArea>
      <div className="px-6 py-4 bg-gray-50 border-t">
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Registration'
          )}
        </Button>
      </div>
    </div>
  )
}

