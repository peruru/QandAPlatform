package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tags.
 */
@Entity
@Table(name = "tags")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tags implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "tags")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "answers", "companies", "tags", "questionLikes", "users", "subTopic" }, allowSetters = true)
    private Set<Questions> questions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tags id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Tags name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Questions> getQuestions() {
        return this.questions;
    }

    public Tags questions(Set<Questions> questions) {
        this.setQuestions(questions);
        return this;
    }

    public Tags addQuestions(Questions questions) {
        this.questions.add(questions);
        questions.getTags().add(this);
        return this;
    }

    public Tags removeQuestions(Questions questions) {
        this.questions.remove(questions);
        questions.getTags().remove(this);
        return this;
    }

    public void setQuestions(Set<Questions> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.removeTags(this));
        }
        if (questions != null) {
            questions.forEach(i -> i.addTags(this));
        }
        this.questions = questions;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tags)) {
            return false;
        }
        return id != null && id.equals(((Tags) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tags{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
