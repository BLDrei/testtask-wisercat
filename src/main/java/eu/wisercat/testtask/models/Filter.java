package eu.wisercat.testtask.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Filter {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Filter() {
    }

    public Filter(String filterType, String compareCondition, String input) {
        this.filterType = filterType;
        this.compareCondition = compareCondition;
        this.input = input;
    }

    private String filterType, compareCondition, input;

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
}
