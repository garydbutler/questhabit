import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format, subDays, startOfWeek, addDays, isToday } from 'date-fns';
import { Colors, Typography, Spacing, Radius } from '../../constants/design';

interface CompletionData {
  date: string;
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
  if (total === 0 || count === 0) return Colors.bg.elevated;
  const ratio = count / total;
  if (ratio >= 1) return Colors.semantic.success;
  if (ratio >= 0.75) return '#059669';
  if (ratio >= 0.5) return '#047857';
  if (ratio >= 0.25) return '#065F46';
  return '#064E3B';
}

export function CalendarHeatmap({ data, weeks = 16, onDayPress }: CalendarHeatmapProps) {
  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subDays(today, (weeks - 1) * 7), { weekStartsOn: 0 });
    
    const dataMap = new Map<string, CompletionData>();
    data.forEach(d => dataMap.set(d.date, d));

    const grid: Array<Array<{ date: Date; dateStr: string; data?: CompletionData }>> = [];
    const monthLabels: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
      const week: typeof grid[0] = [];
      for (let d = 0; d < 7; d++) {
        const date = addDays(startDate, w * 7 + d);
        const dateStr = format(date, 'yyyy-MM-dd');
        
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
                    ? Colors.bg.primary
                    : day.data
                    ? getIntensityColor(day.data.count, day.data.total)
                    : Colors.bg.elevated;

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
        {[Colors.bg.elevated, '#064E3B', '#065F46', '#047857', '#059669', Colors.semantic.success].map((c, i) => (
          <View key={i} style={[styles.legendCell, { backgroundColor: c }]} />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.elevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.primary,
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
    color: Colors.text.muted,
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
    color: Colors.text.muted,
    fontSize: 9,
  },
  scrollContent: {
    paddingRight: Spacing.xs,
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
    borderColor: Colors.accent.primary,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: Spacing.sm,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendLabel: {
    color: Colors.text.muted,
    fontSize: 10,
  },
});
