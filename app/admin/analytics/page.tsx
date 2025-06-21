"use client"

import { useState, useEffect } from "react"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import HelpGuide from "@/components/HelpGuide"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

type AnalyticsData = {
  websiteVisits: number[]
  bookings: number[]
  revenue: number[]
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    websiteVisits: [],
    bookings: [],
    revenue: [],
  })

  useEffect(() => {
    // Fetch analytics data
    // This is a placeholder, replace with actual API call
    setAnalyticsData({
      websiteVisits: [100, 150, 200, 180, 250, 300, 280],
      bookings: [5, 8, 12, 10, 15, 18, 20],
      revenue: [1000, 1600, 2400, 2000, 3000, 3600, 4000],
    })
  }, [])

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const websiteVisitsData = {
    labels,
    datasets: [
      {
        label: "Website Visits",
        data: analyticsData.websiteVisits,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  }

  const bookingsData = {
    labels,
    datasets: [
      {
        label: "Bookings",
        data: analyticsData.bookings,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  const revenueData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: analyticsData.revenue,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="relative">
        <HelpGuide title="Analytics Dashboard">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold">Understanding Your Analytics</h4>
              <p>
                <strong>What:</strong> The Analytics Dashboard provides visual representations of your website traffic,
                bookings, and revenue.
              </p>
              <p>
                <strong>Where:</strong> Data is collected from visitor interactions with your website and
                booking/purchase activities.
              </p>
              <p>
                <strong>When:</strong> Analytics are updated daily. Check them weekly or monthly to track trends and
                make informed decisions.
              </p>
              <p>
                <strong>Why:</strong> Monitoring these metrics helps you understand your business performance and
                identify areas for improvement.
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Chart Explanations</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Website Visits Chart (Teal):</strong> Shows the number of daily visitors to your website.
                  Higher numbers indicate increased interest in your services.
                </li>
                <li>
                  <strong>Bookings Chart (Pink):</strong> Displays the number of bookings made each day. This helps you
                  track which days are most popular for bookings and identify booking trends over time.
                </li>
                <li>
                  <strong>Revenue Chart (Blue):</strong> Shows your daily revenue. This helps you understand the
                  financial performance of your business and identify peak earning periods.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">How to Use Analytics</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Identify Patterns:</strong> Look for days or periods with higher traffic, bookings, or revenue
                  to identify patterns.
                </li>
                <li>
                  <strong>Measure Marketing Effectiveness:</strong> If you see spikes after marketing campaigns, those
                  campaigns are likely effective.
                </li>
                <li>
                  <strong>Forecast Future Trends:</strong> Use historical data to predict busy periods and prepare
                  accordingly.
                </li>
                <li>
                  <strong>Make Data-Driven Decisions:</strong> Base business decisions on actual performance data rather
                  than assumptions.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Best Practices</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Check analytics at least weekly to stay informed about your business performance.</li>
                <li>Compare current data with previous periods to identify growth or decline.</li>
                <li>
                  Look for correlations between different metrics (e.g., do more website visits lead to more bookings?).
                </li>
                <li>Use insights from analytics to inform your marketing, scheduling, and service offerings.</li>
              </ul>
            </div>
          </div>
        </HelpGuide>

        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Website Visits</h2>
          <Bar data={websiteVisitsData} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
          <Line data={bookingsData} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Revenue</h2>
          <Line data={revenueData} />
        </div>
      </div>
    </div>
  )
}
