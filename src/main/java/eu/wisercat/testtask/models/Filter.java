package eu.wisercat.testtask.models;

public class Filter {

    private String filterType, compareCondition, input;

    public Filter() {
    }

    public Filter(String filterType, String compareCondition, String input) {
        this.filterType = filterType;
        this.compareCondition = compareCondition;
        this.input = input;
    }

    public String getFilterType() {
        return filterType;
    }

    public void setFilterType(String filterType) {
        this.filterType = filterType;
    }

    public String getCompareCondition() {
        return compareCondition;
    }

    public void setCompareCondition(String compareCondition) {
        this.compareCondition = compareCondition;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    @Override
    public String toString() {
        return "Filter{" +
                "filterType='" + filterType + '\'' +
                ", compareCondition='" + compareCondition + '\'' +
                ", input='" + input + '\'' +
                '}';
    }
}
