'use client'

import { useProfile } from '@/hooks/use-profile'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import MainLayout from '@/layouts/main'
import { Profile } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

const Page = () => {
  const [profiles, setProfiles] = useState<Profile[]>()
  const { searchProfiles, countProfiles } = useProfile()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)

  const itemsPerPage = 10

  const fetchProfiles = async (
    name?: string,
    minPoint?: number,
    newPage?: number
  ) => {
    const res = await searchProfiles(name, minPoint, false, true, newPage)
    const countRes = await countProfiles(name, minPoint, true)
    if (res) {
      setProfiles(res)
    }

    if (countRes) {
      const pages =
        Math.trunc(countRes / itemsPerPage) + (countRes % itemsPerPage ? 1 : 0)
      setTotalPages(pages)
    }
  }

  const schema = z.object({
    name: z.string().optional(),
    minPoint: z.coerce.number().optional()
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      minPoint: 0
    }
  })

  const submit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true)
    await fetchProfiles(values.name, values.minPoint)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const goToPage = async (newPage: number) => {
    setIsLoading(true)
    const exactPage =
      newPage > totalPages ? totalPages : newPage < 1 ? 1 : newPage
    if (exactPage !== page) {
      setPage(exactPage)
      await fetchProfiles(
        form.getValues().name,
        form.getValues().minPoint,
        exactPage
      )
    }
    setIsLoading(false)
  }

  return (
    <MainLayout>
      <div className="mx-auto flex w-[1280px] max-w-full flex-col">
        <h1 className="mt-10 text-center text-3xl font-bold">Bảng xếp hạng</h1>
        <div className="mx-auto w-[800px] max-w-full">
          <Form {...form}>
            <form
              className="mt-10 flex items-end justify-center gap-8"
              onSubmit={form.handleSubmit(submit)}
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người chơi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên cơ thủ"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="minPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm tích lũy tối thiểu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập điểm tối thiểu"
                        disabled={isLoading}
                        {...field}
                        type="number"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button>
                <Search />
                Tìm kiếm
              </Button>
            </form>
          </Form>
          <Table className="mt-10">
            <TableHeader>
              <TableRow>
                <TableHead>Số thứ tự</TableHead>
                <TableHead>Tên cơ thủ</TableHead>
                <TableHead>Điểm tích lũy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles &&
                profiles.map((profile, index) => (
                  <TableRow key={profile.id} className="h-14">
                    <TableCell className="font-bold">
                      {index + 1 + (page - 1) * itemsPerPage}
                    </TableCell>
                    <TableCell className="font-bold">{profile.name}</TableCell>
                    <TableCell className="font-bold">{profile.point}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Pagination className="mt-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={`${page === 1 && 'cursor-default opacity-50 hover:bg-transparent'}`}
                  onClick={() => goToPage(page - 1)}
                />
              </PaginationItem>
              {totalPages &&
                Array.from(
                  {
                    length: totalPages
                  },
                  (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={page === index + 1}
                        onClick={() => goToPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              <PaginationItem>
                <PaginationNext
                  className={`${page === totalPages && 'cursor-default opacity-50 hover:bg-transparent'}`}
                  onClick={() => goToPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </MainLayout>
  )
}

export default Page
