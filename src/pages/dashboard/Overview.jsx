import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApi } from '../../api/hooks';
import { useAuth } from '../../context/AuthContext';
import useTitle from '../../hooks/useTitle';
import { money } from '../../lib/format';
import PageHeader from '../../components/dashboard/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';

const tick = { fill: 'var(--mute)', fontSize: 12 };
const tooltip = { contentStyle: { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)' }, cursor: { fill: 'var(--subtle)' } };
const STATUS_COLORS = { pending: 'var(--brand)', confirmed: 'var(--ink)', cancelled: 'var(--mute)' };

function ChartCard({ title, empty, children }) {
  return (
    <Card className="p-4">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="h-64">{empty ? <EmptyState title="No bookings yet" /> : <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>}</div>
    </Card>
  );
}

export default function Overview() {
  useTitle('Dashboard');
  const { user } = useAuth();
  const { data, isLoading, error } = useApi('stats-dashboard', '/stats/dashboard');
  const charts = data?.charts;
  const noBookings = !charts || charts.byStatus.length === 0;

  return (
    <>
      <PageHeader title={`Welcome back, ${user.firstName}`} text={data?.role === 'admin' ? 'Platform overview' : 'Your trips at a glance'} />
      {error && <EmptyState title="Dashboard data could not be loaded">Refresh the page to try again.</EmptyState>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24" />)
          : data?.cards.map((c) => (
              <Card key={c.key} className="p-5">
                <p className="text-sm text-mute">{c.label}</p>
                <p className="mt-1 text-3xl font-bold">{c.currency ? money(c.value) : c.value.toLocaleString()}</p>
              </Card>
            ))}
      </div>

      {charts && (
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <ChartCard title="Bookings by destination" empty={charts.byDestination.length === 0}>
            <BarChart data={charts.byDestination}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="name" tick={tick} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} width={32} />
              <Tooltip {...tooltip} />
              <Bar dataKey="bookings" fill="var(--brand)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Bookings over the last 6 months" empty={noBookings}>
            <LineChart data={charts.trend}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="month" tick={tick} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} width={32} />
              <Tooltip {...tooltip} />
              <Line type="monotone" dataKey="bookings" stroke="var(--brand)" strokeWidth={3} dot={{ r: 4, fill: 'var(--brand)' }} />
            </LineChart>
          </ChartCard>

          <ChartCard title="Bookings by status" empty={noBookings}>
            <PieChart>
              <Pie data={charts.byStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} stroke="var(--surface)">
                {charts.byStatus.map((s) => <Cell key={s.name} fill={STATUS_COLORS[s.name]} />)}
              </Pie>
              <Tooltip {...tooltip} />
              <Legend />
            </PieChart>
          </ChartCard>

          <ChartCard title="Booked value over the last 6 months" empty={noBookings}>
            <BarChart data={charts.trend}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="month" tick={tick} tickLine={false} axisLine={false} />
              <YAxis tick={tick} tickLine={false} axisLine={false} width={48} tickFormatter={money} />
              <Tooltip {...tooltip} formatter={(v) => money(v)} />
              <Bar dataKey="amount" fill="var(--ink)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>
      )}
    </>
  );
}
