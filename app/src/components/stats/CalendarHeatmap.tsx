import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format, subDays, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';

interface CompletionData {
  date: string; // YYYY-MM-DD
  count: number;
  total: number;
}

interface CalendarHeatmapProps {
  data: CompletionData[];
  weeks?: number;
  onDayPress?: (date: string, data?: CompletionData) => void;
}

const CELL_SIZE = 14;
const CELL_GAP = 3;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getIntensityColor(count: number, total: number): string {
  if (total === 0 || count === 0) return '#1A1A1A';
  const ratio = count / total;
  if (ratio >= 1) return '#22C55E';      // Perfect day - bright green
  if (ratio >= 0.75) return '#16A34A';   // 75%+ - green
  if (ratio >= 0.5) return '#15803D';    // 50%+ - medium green
  if (ratio >= 0.25) return '#166534';   // 25%+ - dark green
  return '#14532D';                       // Some activity
}

export function CalendarHeatmap({ data, weeks = 16, onDayPress }: CalendarHeatmapProps) {
  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subDays(today, (weeks - 1) * 7), { weekStartsOn: 0 });
    
    // Build data lookup
    const dataMap = new Map<string, CompletionData>();
    data.forEach(d => dataMap.set(d.date, d));

    // Build grid: weeks x 7 days
    const grid: Array<Array<{ date: Date; dateStr: string; data?: CompletionData }>> = [];
    const monthLabels: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
      const week: typeof grid[0] = [];
      for (let d = 0; d < 7; d++) {
        const date = addDays(startDate, w * 7 + d);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Track month boundaries
        const month = date.getMonth();
        if (month !== lastMonth && d === 0) {
          monthLabels.push({ label: format(date, 'MMM'), weekIndex: w });
          lastMonth = month;
        }
        
        week.push({
          date,
          dateStr,
          data: dataMap.get(dateStr),
        });
      }
      grid.push(week);
    }

    return { grid, monthLabels };
  }, [data, weeks]);

  return (
    <View style={styles.container}>
      {/* Month labels */}
      <View style={styles.monthRow}>
        <View style={styles.dayLabelSpace} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.monthLabels, { width: weeks * (CELL_SIZE + CELL_GAP) }]}>
            {monthLabels.map((m, i) => (
              <Text
                key={i}
                style={[
                  styles.monthLabel,
                  { left: m.weekIndex * (CELL_SIZE + CELL_GAP) },
                ]}
              >
                {m.label}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.gridContainer}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {DAY_LABELS.map((label, i) => (
            <View key={i} style={[styles.dayLabel, { height: CELL_SIZE, marginBottom: CELL_GAP }]}>
              <Text style={styles.dayLabelText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Grid */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.grid}>
            {grid.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekColumn}>
                {week.map((day, dayIndex) => {
                  const isFuture = day.date > new Date();
                  const color = isFuture
                    ? '#0F0F0F'
                    : day.data
                    ? getIntensityColor(day.data.count, day.data.total)
                    : '#1A1A1A';

                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.cell,
                        { backgroundColor: color },
                        isToday(day.date) && styles.todayCell,
                      ]}
                      onPress={() => !isFuture && onDayPress?.(day.dateStr, day.data)}
                      disabled={isFuture}
                      activeOpacity={0.7}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        {['#1A1A1A', '#14532D', '#166534', '#15803D', '#16A34A', '#22C55E'].map((c, i) => (
          <View key={i} style={[styles.legendCell, { backgroundColor: c }]} />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
  },
  monthRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabelSpace: {
    width: 28,
  },
  monthLabels: {
    position: 'relative',
    height: 16,
  },
  monthLabel: {
    position: 'absolute',
    color: '#6B6B6B',
    fontSize: 10,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: 4,
  },
  dayLabel: {
    justifyContent: 'center',
    width: 24,
  },
  dayLabelText: {
    color: '#6B6B6B',
    fontSize: 9,
  },
  scrollContent: {
    paddingRight: 8,
  },
  grid: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  weekColumn: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 12,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendLabel: {
    color: '#6B6B6B',
    fontSize: 10,
  },
});
