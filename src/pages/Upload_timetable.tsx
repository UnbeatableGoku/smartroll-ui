import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label"
import { Upload } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import axios, { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from "axios";
import {useForm} from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



type EventCardProps = {
  title: string;
  time: string;
  description: string;
  location: string;
}

type FormValues = {
  file: File | null;
};


const EventCard = ({ title, time, description, location }: EventCardProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="bg-gray-200 p-3 md:p-4 rounded-md dark:bg-black dark:border-gray-800 border cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-900 transition-colors">
        <h4 className="font-semibold text-sm md:text-base">{title}</h4>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{time}</p>
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{title}</h4>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
        <div className="grid gap-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Location:</span>
            <span className="col-span-3 text-sm">{location}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-sm font-medium">Description:</span>
            <span className="col-span-3 text-sm">{description}</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);
export default function Upload_timetable() {

  const [time_table, set_time_table] = useState(false);
  const [load_time_table, set_load_time_table] = useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null)
  // const [file, setFile] = React.useState<string | null>(null)

  const [selectedSemester, setSelectedSemester] = useState<string>()
  const [selectedDivision, setSelectedDivision] = useState<string>()
  const [selectedBranch, setSelectedBranch] = useState<string>()

  const { register, handleSubmit, setValue } = useForm<FormValues>();


  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwODI4ODM4LCJpYXQiOjE3MzA3NDI0MzgsImp0aSI6IjFlMTkyZWUxZDllNTQzZGNhMDVhMmRkOTRkYTQ0NzhhIiwidXNlcl9pZCI6MSwib2JqIjp7ImlkIjoxLCJwcm9maWxlIjp7Im5hbWUiOm51bGwsImVtYWlsIjoibWFuYXZzaGFoMTAxMS5tc0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifSwiYnJhbmNoIjp7ImJyYW5jaF9uYW1lIjoiQ29tcHV0ZXIgRW5naW5lZXJpbmciLCJicmFuY2hfY29kZSI6IjA3Iiwic2x1ZyI6IjMwODQ4MF8xNzMwMjkzMTM5In19fQ.TMpncL7oMrD3SZa8iqMZN3UhDylDoCRx0IbT6IFOO-c"

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    if(data.file){
      // data.file.name = "master_tt.csv"
      formData.append("master_tt.csv", data.file);
      
    }
  
    try {
      const response = await axios.post(
        `https://8cd3-2405-201-2024-b91e-7bbc-2edc-7d07-2a01.ngrok-free.app/manage/upload_master_timetable/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      set_time_table(true)
      console.log("File Uploaded Successfully", response.data);
    } catch (error) {
      console.error("Error Uploading File", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if(file){
      setFileName(file ? file.name : null)
      setValue("file", file);
    }
  }

  const semesters = ["2", "4", "6"]
  const divisions = ["A", "B", "C"]
  const branches = ["A1", "A2", "A3"]

  const days = [
    {
      name: "Monday",
      events: [
        { title: "Team Meeting", time: "9:00 AM - 10:00 AM", description: "Weekly team sync-up", location: "Conference Room A" },
        { title: "Project Review", time: "2:00 PM - 3:00 PM", description: "Review project milestones", location: "Meeting Room 2" }
      ]
    },
    {
      name: "Tuesday",
      events: [
        { title: "Design Review", time: "1:00 PM - 2:00 PM", description: "Review new UI designs", location: "Design Lab" },
        { title: "Client Call", time: "3:00 PM - 4:00 PM", description: "Discuss project progress with client", location: "Video Conference" }
      ]
    },
    {
      name: "Wednesday",
      events: [
        { title: "Weekly Standup", time: "10:00 AM - 11:00 AM", description: "Team standup meeting", location: "Main Office Area" }
      ]
    },
    {
      name: "Thursday",
      events: [
        { title: "Code Review", time: "11:00 AM - 12:00 PM", description: "Review pull requests", location: "Dev Room" }
      ]
    },
    {
      name: "Friday",
      events: [
        { title: "Sprint Planning", time: "9:00 AM - 10:00 AM", description: "Plan next sprint tasks", location: "Conference Room B" }
      ]
    },
    {
      name: "Saturday",
      events: []
    },
    {
      name: "Sunday",
      events: []
    }
  ];




  return (
    <>
      {
        time_table == false && (
          // upload master time table 
          <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8  mt-24">
            <div className="max-w-md w-full space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                  Upload Master Time-Table
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Select a file from your computer to upload
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 " />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 ">
                      <Label
                        htmlFor="file-upload"
                        className="relative w-20 h-6 flex items-center justify-center cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:bg-gray-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <span>Select a file</span>
                        <Input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          onChange={handleFileChange}

                        />
                      </Label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      excel file
                    </p>
                  </div>
                </div>

                {fileName && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Selected file: {fileName}
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white dark:bg-black hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600  dark:hover:bg-zinc-600 dark:border-gray-800"
                  >
                    Upload File
                  </Button>
                </div>
              </form>
            </div>
          </main>
        )
      }
      {
        time_table == true &&
        (
          <div className='w-full flex flex-col space-y-4'>
            {/* time table selection */}
            <div className="flex flex-col space-y-2 md:space-y-4 rounded-xl">
              <div className="w-full flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 lg:space-x-12 justify-center">
                {/* Stream Selection Card */}
                <div className="relative w-full md:w-[240px] lg:w-[320px]">
                  <Card className="w-full h-auto  dark:bg-black">
                    <CardHeader className="pb-2 space-y-0 pt-2">
                      <CardTitle className="text-base sm:text-lg text-center">Stream</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <Select
                        value={selectedSemester}
                        onValueChange={(value) => {
                          setSelectedSemester(value)
                          setSelectedDivision(undefined)
                          setSelectedBranch(undefined)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Stream" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((semester) => (
                            <SelectItem key={semester} value={semester}>
                              Semester {semester}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                  {/* Connecting Lines */}
                  <div className="absolute hidden md:block right-[-2rem] lg:right-[-3.5rem] top-1/2 w-8 lg:w-14 h-[3px] bg-gray-400" />
                  <div className="absolute md:hidden bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 w-[3px] h-6 bg-gray-400" />
                </div>

                {/* Semester Selection Card */}
                <div className="relative w-full md:w-[240px] lg:w-[320px]">
                  <Card className="w-full h-auto dark:bg-black">
                    <CardHeader className="pb-2 space-y-0 pt-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base sm:text-lg text-center">Semester</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      {selectedSemester ? (
                        <Select
                          value={selectedDivision}
                          onValueChange={(value) => {
                            setSelectedDivision(value)
                            setSelectedBranch(undefined)
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {divisions.map((division) => (
                              <SelectItem key={division} value={division}>
                                Semester {division}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          <Skeleton className="w-full h-9 sm:h-9" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {/* Connecting Lines */}
                  <div className="absolute hidden md:block right-[-2rem] lg:right-[-3.0rem] top-1/2 w-8 lg:w-12 h-[3px] bg-gray-400" />
                  <div className="absolute md:hidden bottom-[-1.0rem] left-1/2 transform -translate-x-1/2 w-[3px] h-4 bg-gray-400" />
                </div>

                {/* Division Selection Card */}
                <div className="w-full md:w-[240px] lg:w-[320px]">
                  <Card className="w-full h-auto dark:bg-black">
                    <CardHeader className="pb-2 space-y-0 pt-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base sm:text-lg text-center">Division</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      {selectedDivision ? (
                        <Select
                          value={selectedBranch}
                          onValueChange={()=>{set_load_time_table(true)}}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Division" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch} value={branch}>
                                Division {branch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          <Skeleton className="w-full h-10 sm:h-9" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            {/* time table view  */}
            {
              load_time_table == true ? (
                <Card className="w-full min-h-[400px] max-h-max dark:bg-black dark:border-gray-800">
              <CardHeader className="flex flex-row justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b dark:border-gray-800">
                <h2 className="text-base md:text-lg font-semibold dark:text-white">Timetable</h2>
              </CardHeader>
              <ScrollArea className="h-[calc(100%-70px)]">
                <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 p-4">
                  {days.map((day, index) => (
                    <div key={day.name} className="flex flex-col gap-3 md:gap-4 ">
                      <h3 className="font-medium dark:text-white text-center">{day.name}</h3>
                      {day.events.length > 0 ? (
                        day.events.map((event, eventIndex) => (
                          <EventCard
                            key={eventIndex}
                            title={event.title}
                            time={event.time}
                            description={event.description}
                            location={event.location}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No Lectures</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
              ) : (
                <div className="flex flex-col gap-4 items-center ">
                  <Skeleton className="w-full h-20 sm:h-18" />
                  <Skeleton className="w-full h-20 sm:h-18" />
                  <Skeleton className="w-full h-20 sm:h-18" />
                  <Skeleton className="w-full h-20 sm:h-18" />
                  <Skeleton className="w-full h-20 sm:h-18" />
                </div>
              )
            }
            
          </div>
        )
      }
    </>
  );
}