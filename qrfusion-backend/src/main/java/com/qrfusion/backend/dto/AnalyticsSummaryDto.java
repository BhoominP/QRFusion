package com.qrfusion.backend.dto;

import java.util.List;

public class AnalyticsSummaryDto {
    private long totalCodes;
    private long totalScans;
    private long activeCampaigns;
    private List<ScanTrendPoint> scanTrends;
    private List<FormatCount> formatBreakdown;

    public static class ScanTrendPoint {
        private String date;
        private long scans;
        private long uniqueScans;

        public ScanTrendPoint(String date, long scans, long uniqueScans) {
            this.date = date;
            this.scans = scans;
            this.uniqueScans = uniqueScans;
        }

        public String getDate() {
            return date;
        }

        public long getScans() {
            return scans;
        }

        public long getUniqueScans() {
            return uniqueScans;
        }
    }

    public static class FormatCount {
        private String format;
        private long count;
        private double percentage;

        public FormatCount(String format, long count, double percentage) {
            this.format = format;
            this.count = count;
            this.percentage = percentage;
        }

        public String getFormat() {
            return format;
        }

        public long getCount() {
            return count;
        }

        public double getPercentage() {
            return percentage;
        }
    }

    public long getTotalCodes() {
        return totalCodes;
    }

    public void setTotalCodes(long totalCodes) {
        this.totalCodes = totalCodes;
    }

    public long getTotalScans() {
        return totalScans;
    }

    public void setTotalScans(long totalScans) {
        this.totalScans = totalScans;
    }

    public long getActiveCampaigns() {
        return activeCampaigns;
    }

    public void setActiveCampaigns(long activeCampaigns) {
        this.activeCampaigns = activeCampaigns;
    }

    public List<ScanTrendPoint> getScanTrends() {
        return scanTrends;
    }

    public void setScanTrends(List<ScanTrendPoint> scanTrends) {
        this.scanTrends = scanTrends;
    }

    public List<FormatCount> getFormatBreakdown() {
        return formatBreakdown;
    }

    public void setFormatBreakdown(List<FormatCount> formatBreakdown) {
        this.formatBreakdown = formatBreakdown;
    }
}
