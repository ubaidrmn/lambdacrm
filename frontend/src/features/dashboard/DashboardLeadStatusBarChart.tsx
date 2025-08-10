"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getLeadsApi } from "../leads/api"
import { useParams } from "react-router"
import { LeadStatus } from "@/types/lead.model"

export const description = "A horizontal bar chart"

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
  
} satisfies ChartConfig

function DashboardLeadStatusBarChart() {
  const params: any = useParams();
  const { data } = useQuery({
    queryKey: ["get-leads"],
    queryFn: async () => await getLeadsApi(params.organizationId),
    initialData: [],
  });

const chartData = useMemo(() => {
  if (!data?.length) return [];

  let newLeadsCount = 0;
  let qualifiedLeadsCount = 0;
  let contactedLeadsCount = 0;

  for (const lead of data) {
    switch (lead.status) {
      case LeadStatus.NEW:
        newLeadsCount++;
        break;
      case LeadStatus.CONTACTED:
        contactedLeadsCount++;
        break;
      case LeadStatus.QUALIFIED:
        qualifiedLeadsCount++;
        break;
    }
  }

  return [
    { status: LeadStatus.NEW, count: newLeadsCount },
    { status: LeadStatus.QUALIFIED, count: qualifiedLeadsCount },
    { status: LeadStatus.CONTACTED, count: contactedLeadsCount },
  ];
}, [data]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Status</CardTitle>
        <CardDescription>Overview of leads grouped by status: New, Qualified, and Contacted.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer style={{ height: 300 }} config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 30,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default DashboardLeadStatusBarChart;
