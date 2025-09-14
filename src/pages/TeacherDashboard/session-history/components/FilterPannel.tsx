import React from 'react'

import { filterOption } from '../types'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  BookOpen,
  Building2,
  Calendar,
  Filter,
  GraduationCap,
} from 'lucide-react'

import { MultiSelect } from '@components/common/multi-select'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'

interface props {
  isFilterOpen: boolean
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
  filterOptions: filterOption
  applyFilters: any
  checkFilters: any
  clearFilters: any
  filters: any
  setFilters: any
  handleFilterChange: any
}

const FilterPannel = ({
  isFilterOpen,
  setIsFilterOpen,
  filterOptions,
  applyFilters,
  clearFilters,
  filters,
  handleFilterChange,
}: props) => {
  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent className="!top-0 flex w-full flex-col border-l-2 border-border bg-card !p-4 sm:w-[420px] md:w-[600px] md:max-w-md">
        <SheetHeader className="border-b pb-2">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Filter className="h-5 w-5 text-primary" />
            Filter Options
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable filter form */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Branch Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-normal">
              <Building2 className="h-4 w-4 text-primary" />
              Branch
            </Label>

            <MultiSelect
              options={filterOptions.branches}
              onValueChange={(values) => handleFilterChange('branches', values)}
              defaultValue={filters.branches}
              placeholder="Select branches..."
              maxCount={5}
              className="w-full border-2 border-input transition-colors focus-within:border-primary hover:border-primary/50"
            />
          </div>

          {/* Semester Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-normal">
              <GraduationCap className="h-4 w-4 text-primary" />
              Semester
            </Label>

            <MultiSelect
              options={filterOptions.semesters}
              onValueChange={(values) =>
                handleFilterChange('semesters', values)
              }
              defaultValue={filters.semesters}
              placeholder="Select semesters..."
              maxCount={3}
              className="w-full border-2 border-input transition-colors focus-within:border-primary hover:border-primary/50"
            />
          </div>

          {/* Division Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-normal">
              <GraduationCap className="h-4 w-4 text-primary" />
              Division
            </Label>

            <MultiSelect
              options={filterOptions.divisions}
              onValueChange={(values) =>
                handleFilterChange('divisions', values)
              }
              defaultValue={filters.divisions}
              placeholder="Select divisions..."
              maxCount={3}
              className="w-full border-2 border-input transition-colors focus-within:border-primary hover:border-primary/50"
            />
          </div>

          {/* Subject Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-normal">
              <BookOpen className="h-4 w-4 text-primary" />
              Subject
            </Label>

            <MultiSelect
              options={filterOptions.subjects}
              onValueChange={(values) => handleFilterChange('subjects', values)}
              defaultValue={filters.subjects}
              placeholder="Select subjects..."
              maxCount={2}
              className="w-full border-2 border-input transition-colors focus-within:border-primary hover:border-primary/50"
            />
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-normal">
              <Calendar className="h-4 w-4 text-primary" />
              Date Range
            </Label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-normal">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange('startDate', e.target.value)
                  }
                  className="w-full rounded-lg border-2 border-input px-4 py-3 transition-colors hover:border-primary/50 focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate" className="text-sm font-normal">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange('endDate', e.target.value)
                  }
                  className="w-full rounded-lg border-2 border-input px-4 py-3 transition-colors hover:border-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 border-t bg-card pt-2">
          <Button
            onClick={applyFilters}
            className="h-10 w-full rounded-lg border-2 border-submit bg-submit text-base font-medium transition-colors hover:bg-submit/90"
          >
            Apply Filters
          </Button>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="h-10 w-full rounded-lg border-2 border-input bg-transparent text-base font-medium transition-colors hover:border-primary/50 hover:bg-muted"
          >
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FilterPannel
